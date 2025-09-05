# Front-End Architecture & Page Specifications

## Goals

Provide a coherent, role-aware Next.js App Router front-end that:

- Surfaces MVP workflows with minimal navigation friction.
- Scales to post-MVP modules (attention engine, dashboards, DC events, retreats, education) without large refactors.
- Encourages reuse via shared primitives (layout shell, data fetching hooks, form + table components, role guards).

## Tech Stack (Web)

| Concern           | Choice                                      | Notes                                                               |
| ----------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| Framework         | Next.js (App Router)                        | Server Components where possible; client islands for interactivity. |
| Styling           | Tailwind CSS + Radix UI                     | Utility-first + accessible primitives.                              |
| Data Fetch        | tRPC (planned) / REST placeholder           | Transition path: keep fetch layer abstracted.                       |
| Auth              | Auth.js (email magic link)                  | Session available server-side for role gating.                      |
| State             | React Query (TanStack Query)                | Cache server data, optimistic updates for logs/forms.               |
| Forms             | React Hook Form + Zod resolver              | Shared <Form /> wrapper with field components.                      |
| Charts (post-mvp) | Chart.js or Recharts                        | For unit metrics & attention trends.                                |
| Testing           | Vitest / Testing Library / Playwright (E2E) | Focus on critical flows: login, log contact, add initiation.        |

## Architectural Layers

```
/app               # Route segments & RSC boundaries
  (public)/        # Unauthenticated pages (marketing / sign-in)
  (auth)/          # Authenticated shell (layout with nav, role-based)
    dashboard/     # Personalized landing (role adaptive)
    mentees/       # Mentor-focused list & detail
    users/         # Admin user management (existing)
    units/         # Admin / secretary unit mgmt
    initiation/    # Acarya flows
    lessons/       # Lesson progression
    attention/     # Attention engine list
    profile/       # User self profile
    link-telegram/ # Account linking flow
    settings/      # Personal + notification prefs (post-mvp)
  api/             # Route handlers (if any; tRPC preferred)
/components        # Presentational + interactive components
/lib               # Client utils (auth, fetch wrappers, hooks)
/hooks             # Reusable data hooks (useMentees, useUnitMetrics)
/styles            # Tailwind config, globals
```

## Shared Component Primitives

| Component                 | Purpose                                             | Notes                                                               |
| ------------------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| LayoutShell               | Top nav + side nav + content container              | Injects role-based nav sections.                                    |
| RoleGuard                 | Conditionally render children based on traits/roles | Server component for early bail; client variant for conditional UI. |
| DataTable                 | Generic table with columns, sorting, empty state    | Wraps TanStack Table.                                               |
| EntityCard                | Quick summary (user, mentee, unit)                  | Small consistent card style.                                        |
| StatTile                  | Metric w/ delta                                     | Unit dashboard, mentor overview.                                    |
| Timeline                  | Chronological events (contacts, lessons)            | Reusable for user detail view.                                      |
| ContactLogForm            | 30s contact logging UI                              | Inline + modal modes.                                               |
| LessonProgressForm        | Manage lesson entries                               | Validation: sequential constraint.                                  |
| InitiationForm            | Capture initiation event                            | Role restricted (acarya).                                           |
| PracticeStatusWidget      | Display + inline update regularity                  | Color-coded severity.                                               |
| AttentionBadge            | Compute and display attention state                 | Derives rule or consumes precomputed flag.                          |
| InviteUserForm            | Mentor invite or admin user add                     | Extends existing create user.                                       |
| TelegramLinkPanel         | Guides linking flow                                 | Polling state of link.                                              |
| AuditTrailList (post-mvp) | Show audited actions                                | Admin only.                                                         |

## Navigation Model

Primary navigation is role-aware; each persona lands on tailored dashboard slice:

| Role           | Default Landing                         | Key Nav Sections                                           |
| -------------- | --------------------------------------- | ---------------------------------------------------------- |
| Seeker         | /dashboard (mentor + next lesson panel) | Dashboard, Lessons, Profile, Link Telegram                 |
| Mentor         | /mentees                                | Mentees, Dashboard, Attention, Lessons (overview), Profile |
| Unit Secretary | /units                                  | Units, Dashboard, Mentor Load, Attention                   |
| Acarya         | /initiation                             | Initiations, Lessons, Dashboard, Attention                 |
| Admin          | /users                                  | Users, Units, Roles, Audit (post-mvp), Settings            |

A composite user with multiple roles sees merged sections.

## Page / Route Specifications (MVP & Immediate Post-MVP)

Each entry lists: Purpose, Key Components, Data Dependencies, Covered User Stories (tag). If post-MVP, flagged accordingly.

### 1. / (redirect to /dashboard or public landing)

- Purpose: Entry point. If authenticated -> role-aware redirect. If not -> marketing / sign-in.
- Components: PublicLanding (future), AuthCTA.
- Stories: Implicit access path for all roles.

### 2. /dashboard

- Purpose: Personalized snapshot.
- Components: StatTile grid (mentor: counts needing contact, mentees w/ irregular practice), MentorQuickActions (Log Contact, Invite), SeekerNextStepCard, LessonProgressSummary, AttentionList (top 5), UnitSecretaryMetrics (if role), AcaryaUpcomingInitiations (if role).
- Data: Aggregated metrics endpoints (to be added), user session, mentee attention list.
- Stories: Mentor reminders (MVP), Seeker view lessons & next step (MVP), Unit metrics (MVP for secretary), Acarya view initiated (MVP).

### 3. /profile

- Purpose: User self profile & basics update.
- Components: ProfileForm (name, optional demographic), MentorInfoCard (assigned mentor & acarya contacts), PracticeStatusWidget, TelegramLinkPanel.
- Data: user, mentor link, practice status, telegram link.
- Stories: Seeker minimal profile (MVP), View mentor & acarya contacts (MVP), Link Telegram account (MVP).

### 4. /link-telegram

- Purpose: Dedicated linking flow (deep link from bot / email).
- Components: TelegramLinkPanel (shows code, status), HelpFAQ.
- Data: provisional link token.
- Stories: Link Telegram account (MVP).

### 5. /mentees

- Purpose: Mentor's list-centric workspace.
- Components: FilterBar (attention status, practice regularity), DataTable<Mentee>, BulkInviteBanner (post-mvp), QuickAddContact (inline), ExportCSV (future).
- Row Composition: Name + badges (traits), PracticeStatusWidget, LastContact date w/ aging color, AttentionBadge, Actions (Log Contact, Open Detail).
- Data: mentees list w/ derived fields (last_contact_at, practice, next lesson eligibility, attention flags).
- Stories: View mentee list with indicators (MVP), Log contact quickly (MVP), Invite new person (MVP), Reminders for inactivity (MVP), Bulk messaging (future), Follow-up date (post-mvp).

### 6. /mentees/[id]

- Purpose: Deep dive on one mentee.
- Components: Header (name, roles, unit), LessonProgressSummary + add, PracticeStatusWidget (editable), ContactLogList + ContactLogForm (inline), InitiationHistoryCard, MentorActionsSidebar (Set Follow-Up (post-mvp), Invite again, Remove link), AttentionBadge.
- Data: user core, mentor link, contact logs, lesson progress, practice status, initiation events, computed attention.
- Stories: Update lesson progression (Acarya uses /lessons but mentor may view), Log contact (MVP), Set follow-up date (post-mvp), View initiation & lessons (MVP via acarya/mentor visibility).

### 7. /users (already exists - refine)

- Purpose: Admin user management.
- Components (future enhancements): DataTable<Users>, TraitAssignmentPanel, InviteUserForm, UnitMembershipEditor.
- Stories: Assign/remove traits & roles (MVP), Invite (Mentor) new person (MVP), Create units & set secretary (partially on /units), Soft delete/anonymize (post-mvp).

### 8. /units

- Purpose: Manage units & secretary assignment; view unassigned mentees.
- Components: UnitsList + UnitCard, UnassignedMenteesPanel, UnitSecretaryAssignmentForm, MentorLoadDistributionChart (post-mvp), CreateUnitForm.
- Data: units, memberships, mentor-mentee counts per unit, unassigned mentees.
- Stories: Create units & set unit secretary (MVP), Unit metrics (MVP), Mentor load distribution (post-mvp), Unassigned mentees (MVP).

### 9. /initiation

- Purpose: Record initiation events (acarya) & overview list.
- Components: InitiationForm, InitiationEventsTable, Filters (date range, unit), ExportButton (future).
- Data: initiation events, user lookup.
- Stories: Record initiation events (MVP), View initiated margiis w/ status (MVP).

### 10. /lessons

- Purpose: Manage lesson progression (acarya) + global view.
- Components: LessonProgressTable, AddLessonProgressForm (validates order), MenteeSearchBar.
- Data: lesson progress entries, user mapping.
- Stories: Update lesson progression (MVP), View lessons (Seeker/Mentor portion via limited data) (MVP).

### 11. /attention (post-MVP early)

- Purpose: Central attention queue (mentors + secretaries + acaryas).
- Components: AttentionRuleFilters, DataTable<AttentionItem>, ActionBar (Log Contact, Mark Acknowledged), AgingBadge.
- Data: attention engine output (precomputed daily + on-demand).
- Stories: Attention list surface (Phase 5), Daily summary (ties into scheduled notifications).

### 12. /contact/new (maybe modal route under mentees)

- Purpose: Ultra-fast contact logging.
- Components: ContactLogForm (channel, notes, flags, follow-up date), AutosaveIndicator.
- Data: mentee list, default channel.
- Stories: Log contact in <30s (MVP), Set follow-up date (post-mvp).

### 13. /roles (admin)

- Purpose: Central trait assignment and audit view.
- Components: UserTraitMatrix, AuditTrailList (post-mvp), BulkRoleAssignDialog.
- Stories: Assign/remove traits & roles (MVP), Audit log (post-mvp).

### 14. /reports/unit (secretary, post-mvp)

- Purpose: Extended metrics: mentor load, DC attendance (later), distribution charts.
- Components: MentorLoadDistributionChart, AttendancePlaceholderCard.
- Stories: Mentor load distribution (post-mvp), DC attendance % (post-mvp).

### 15. Future Modules (Placeholders /feature/\* or behind feature flags)

- /dc-events, /retreats, /courses, /finance, /announcements

## Component-to-Story Mapping Matrix (MVP)

| Story                                  | Component(s)                                            | Route(s)                              |
| -------------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| Register & create minimal profile      | ProfileForm (public sign-in flow)                       | / (signup), /profile                  |
| View assigned mentor & acarya contacts | MentorInfoCard                                          | /profile                              |
| See received lessons & next step       | LessonProgressSummary, SeekerNextStepCard               | /dashboard, /profile                  |
| View mentee list indicators            | DataTable<Mentee>, PracticeStatusWidget, AttentionBadge | /mentees                              |
| Log contact <30s                       | ContactLogForm (quick), QuickAddContact                 | /mentees, /contact/new, /mentees/[id] |
| Reminders for inactivity               | AttentionBadge + AttentionList                          | /dashboard, /mentees                  |
| Invite new person                      | InviteUserForm / QuickInvite                            | /mentees, /users                      |
| View unit metrics                      | StatTile, UnitSecretaryMetrics, UnitsList               | /dashboard, /units                    |
| Record initiation events               | InitiationForm                                          | /initiation                           |
| Update lesson progression              | LessonProgressTable, AddLessonProgressForm              | /lessons, /mentees/[id]               |
| View initiated margiis w/ status       | InitiationEventsTable                                   | /initiation                           |
| Assign/remove traits & roles           | TraitAssignmentPanel, UserTraitMatrix                   | /users, /roles                        |
| Create units & set secretary           | CreateUnitForm, UnitSecretaryAssignmentForm             | /units                                |
| Link Telegram account                  | TelegramLinkPanel                                       | /profile, /link-telegram              |

## Data Fetching & Caching Strategy

- Server Components fetch base lists (mentees, units) with session; pass to client islands for mutations.
- React Query for contact log mutations (optimistic append) & practice status updates.
- Derived fields (attention flags, next lesson eligibility) computed server-side to keep client light.
- Use `staleTime` tuned per entity (e.g., contact logs 0, mentees 30s, static lists 5m).

## Access Control Patterns

- `getSession()` in server components to gate early.
- RoleGuard wrapper enforces trait presence; returns 404 (avoid leaking existence) for unauthorized.
- Field-level gating (e.g., practice regularity editable by mentor & mentee, lesson update only acarya).

## Performance & UX Considerations

- Split large tables with virtualization (mentee list > 200 rows) using react-virtual.
- Prioritize first meaningful paint: load skeleton cards in /dashboard while fetching metrics in parallel.
- Use route segment loading & error UI (Next.js conventions) for resilience.

## Styling & Design Tokens (Planned)

- Theme scale (colors semantic): primary, accent, danger, warning, success, surface, subtle-bg.
- Spacing scale (4px base): 1..10.
- Radius scale: sm (4), md (6), lg (10), pill (9999).
- Light mode first; dark mode toggle post-mvp.

## Testing Strategy (MVP focus)

| Layer            | Tests                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| Unit             | Pure utils (attention calculations)                                      |
| Component        | ContactLogForm, LessonProgressForm validation                            |
| Integration      | Mentor logs contact -> shows in mentee detail timeline                   |
| E2E (Playwright) | Sign-in, create unit, assign secretary, link mentor->mentee, log contact |

## Migration Plan from Current State

1. Introduce LayoutShell + navigation; wrap existing pages (`/users`, `/identity` evolves into `/units` + split responsibilities).
2. Add `/dashboard` (empty scaffold) & `/profile`.
3. Implement `/mentees` list (replace manual identity combos for mentors).
4. Add forms for contact logs & practice status.
5. Implement initiation & lessons pages for acarya workflows.
6. Build attention derivation endpoint + `/attention` (post-MVP step once rule engine ready).

## Open Questions

- Exact shape of tRPC procedures (naming, batching)?
- Should mentor link creation live on /mentees or /users? (lean: /mentees QuickInvite)
- Practice status update frequency constraints?
- Unified audit feed or per-entity log view?

## Future Enhancements (Non-MVP)

- Realtime presence (WebSocket) for collaborative mentoring sessions.
- Offline queue for contact logging on unstable networks.
- Feature flag system to progressively roll out modules.
