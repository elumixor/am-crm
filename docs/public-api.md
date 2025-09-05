# Public API Documentation (MVP Draft)

_Status: Updated for refactored single-unit user model, profile (/me) endpoints, lessons JSON array, unit registration dates. Future domain endpoints (contact logs, initiation, attention, auth) will extend this spec or move to tRPC._

Base URL (local dev): `http://localhost:3001`

All responses are JSON unless noted. Timestamps are ISO8601 strings. Currently **no authentication / authorization middleware** is enforced (MVP scaffolding). IMPORTANT: In production this must be restricted (session / token) prior to exposure.

## Conventions

- `id` fields are opaque UUID strings (from Prisma default).
- Missing resources return `404 not found` (where implemented) else silently ignore on delete (idempotent style).
- Create returns `201` with resource body.
- Delete returns `204` with empty body.
- Validation errors return `400` with text message body.

## Resource Models (As Returned)

### User

```
{
  id: string,
  email: string,
  fullName: string | null,
  spiritualName: string | null,
  displayName: string | null,
  telegramHandle: string | null,
  whatsapp: string | null,
  photoUrl: string | null,
  dateOfBirth: string | null,        // ISO date
  nationality: string | null,
  languages: string | null,          // comma separated or null
  location: string | null,
  preferredLanguage: string | null,
  unitId: string | null,             // single unit membership
  mentorId: string | null,
  acaryaId: string | null,
  lessons: { lesson: number, receivedAt: string | null }[], // ordered 0..6
  menteeIds: string[],               // users mentored by this user
  initiateIds: string[],             // users initiated by this user (placeholder)
  traits: UserTrait[]
}
```

### UserTrait

```
{
  id: string,
  createdAt: string,
  userId: string,
  trait: string          // e.g. 'mentor', 'acarya', 'unit_secretary'
}
```

### Unit

```
{
  id: string,
  name: string,
  description: string | null,
  unofficialRegisteredAt: string | null, // ISO
  officialRegisteredAt: string | null,   // ISO
  userIds: string[]
}
```

## Endpoints

### Health

| Method | Path      | Description          | Status Codes |
| ------ | --------- | -------------------- | ------------ |
| GET    | `/`       | Liveness root        | 200          |
| GET    | `/health` | Health check (no DB) | 200          |

### Users (legacy basic CRUD; profile-oriented updates via /me)

| Method | Path         | Description                   | Body (Request)       | Responses                        |
| ------ | ------------ | ----------------------------- | -------------------- | -------------------------------- |
| GET    | `/users`     | List users (with traits)      | –                    | 200 `[User[]]`                   |
| POST   | `/users`     | Create user                   | `{ email: string }`  | 201 `User` / 400 (missing email) |
| PUT    | `/users/:id` | Update email only (temporary) | `{ email?: string }` | 200 `User` / 404                 |
| DELETE | `/users/:id` | Delete user                   | –                    | 204 (idempotent)                 |

#### Traits (User Role/Trait Assignment)

| Method | Path                       | Description                     | Body                | Responses             |
| ------ | -------------------------- | ------------------------------- | ------------------- | --------------------- |
| GET    | `/users/:id/traits`        | List traits for user            | –                   | 200 `[UserTrait[]]`   |
| POST   | `/users/:id/traits`        | Add trait (idempotent by trait) | `{ trait: string }` | 201 `UserTrait` / 400 |
| DELETE | `/users/:id/traits/:trait` | Remove trait                    | –                   | 204                   |

#### Examples

Create user:

```bash
curl -X POST http://localhost:3001/users \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","name":"Alice"}'
```

Add mentor trait:

```bash
curl -X POST http://localhost:3001/users/USER_ID/traits \
  -H 'Content-Type: application/json' \
  -d '{"trait":"mentor"}'
```

### Units

| Method | Path         | Description                     | Body                                      | Responses        |
| ------ | ------------ | ------------------------------- | ----------------------------------------- | ---------------- |
| GET    | `/units`     | List units (with userIds)       | –                                         | 200 `[Unit[]]`   |
| POST   | `/units`     | Create unit                     | `{ name: string, description?: string }`  | 201 `Unit` / 400 |
| PUT    | `/units/:id` | Update unit (name, description) | `{ name?: string, description?: string }` | 200 `Unit` / 404 |
| DELETE | `/units/:id` | Delete unit                     | –                                         | 204              |

> Membership management is now implicit: set a user's `unitId` via profile update instead of separate membership endpoints.

### Profile (/me)

Authenticated endpoints (placeholder auth; currently header `Authorization: Bearer <userId>` for dev only):

| Method | Path          | Description                   | Body (Request)                      | Responses                 |
| ------ | ------------- | ----------------------------- | ----------------------------------- | ------------------------- |
| GET    | `/me`         | Get current user profile      | –                                   | 200 `User` / 401          |
| PUT    | `/me`         | Update profile & lessons      | Partial user fields (see below)     | 200 `User` / 401          |
| PUT    | `/me/mentees` | Set mentee list (mentor link) | `{ menteeIds: string[] }`           | 200 `User` / 401          |
| POST   | `/me/photo`   | Upload/replace profile photo  | `multipart/form-data` field `photo` | 200 `{ url }` / 401 / 400 |

Profile update accepted fields: `fullName, spiritualName, displayName, telegramHandle, whatsapp, photoUrl, dateOfBirth (ISO), nationality, languages, location, preferredLanguage, unitId, mentorId, acaryaId, lessons`.

Photo upload example (replace existing photo):

```bash
curl -X POST http://localhost:3001/me/photo \
  -H 'Authorization: Bearer <token>' \
  -F 'photo=@/path/to/image.jpg'
```

Lessons array example:

```json
{
  "lessons": [
    { "lesson": 0, "receivedAt": "2025-01-10T00:00:00.000Z" },
    { "lesson": 1, "receivedAt": null }
  ]
}
```

### CORS Behavior

Allowed origins are enumerated via environment variables:

- `LOCAL_FRONTEND_URL`
- `VERCEL_PROD_URL`
- `VERCEL_DEV_URL`

If request Origin header matches one of the populated values it is echoed back; otherwise requests without an Origin are allowed (`*`), and non-matching origins are rejected (empty origin string response). Adjust prior to production hardening.

### Error Responses

| Scenario                             | Status | Body                             |
| ------------------------------------ | ------ | -------------------------------- |
| Missing required field (e.g., email) | 400    | `text/plain` descriptive message |
| Resource not found (update)          | 404    | `text/plain` "not found"         |
| Delete non-existent resource         | 204    | empty (idempotent)               |

### Roadmap (Planned / Not Implemented Yet)

These are not yet implemented but referenced in user stories & data model:

- Contact Logs: `POST /contact-logs`, `GET /mentees/:id/contact-logs`
- Mentor Links: explicit endpoints to link/unlink mentor & mentee
- Practice Status: `GET/PUT /users/:id/practice` for regularity updates
- Initiations: CRUD for initiation records
  -- Lesson Progress: dedicated history endpoints (current model is embedded array)
- Attention Engine: `GET /attention` (derived list)
- Telegram Linking: `POST /auth/telegram/init`, `POST /auth/telegram/confirm`
- Auth Sessions: `POST /auth/magic-link`, `GET /auth/session`, `POST /auth/logout`

### Versioning Strategy (Proposed)

Currently unversioned. Before broad adoption introduce prefix (e.g., `/v1`). For internal Next.js + bot consumption, unversioned iteration acceptable until contract stabilizes.

### Security & Hardening TODOs

- Add authentication (Auth.js session validation middleware) before any PII beyond email is exposed.
- Rate limit mutation endpoints (traits, memberships) by user/session.
- Input validation with Zod to replace manual checks.
- Add audit logging for trait changes & unit membership changes.

### Changelog

- 2025-09-05: Refactored for single-unit model; removed membership endpoints; added /me profile & mentees; added lessons array; units expose registration timestamps.
- 2025-09-04: Initial documentation draft.

---

_Last updated: 2025-09-05_
