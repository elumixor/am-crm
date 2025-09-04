# Public API Documentation (MVP Draft)

_Status: Covers currently implemented REST endpoints in `packages/api`. Future domain endpoints (contact logs, lessons, initiation, attention, auth) will extend this spec or move to tRPC._

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
  createdAt: string,      // ISO date
  email: string,
  name: string | null,
  traits: UserTrait[],
  memberships: UnitMembership[]
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
  createdAt: string,
  name: string,
  description: string | null,
  memberships: UnitMembership[]
}
```

### UnitMembership

```
{
  id: string,
  createdAt: string,
  userId: string,
  unitId: string,
  role: string            // 'MEMBER' | 'SECRETARY' etc.
}
```

## Endpoints

### Health

| Method | Path      | Description          | Status Codes |
| ------ | --------- | -------------------- | ------------ |
| GET    | `/`       | Liveness root        | 200          |
| GET    | `/health` | Health check (no DB) | 200          |

### Users

| Method | Path         | Description                            | Body (Request)                      | Responses                        |
| ------ | ------------ | -------------------------------------- | ----------------------------------- | -------------------------------- |
| GET    | `/users`     | List users (with traits & memberships) | –                                   | 200 `[User[]]`                   |
| POST   | `/users`     | Create user                            | `{ email: string, name?: string }`  | 201 `User` / 400 (missing email) |
| PUT    | `/users/:id` | Update user fields (email, name)       | `{ email?: string, name?: string }` | 200 `User` / 404                 |
| DELETE | `/users/:id` | Delete user                            | –                                   | 204 (idempotent)                 |

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

| Method | Path         | Description                     | Body                                     | Responses        |
| ------ | ------------ | ------------------------------- | ---------------------------------------- | ---------------- | ---------------- |
| GET    | `/units`     | List units (with memberships)   | –                                        | 200 `[Unit[]]`   |
| POST   | `/units`     | Create unit                     | `{ name: string, description?: string }` | 201 `Unit` / 400 |
| PUT    | `/units/:id` | Update unit (name, description) | `{ name?: string, description?: string   | null }`          | 200 `Unit` / 404 |
| DELETE | `/units/:id` | Delete unit                     | –                                        | 204              |

#### Unit Memberships (Add / List / Remove)

(Two perspectives exist; current implementation mixes user & unit focused paths)

| Method | Path                             | Description                             | Body                                | Responses                  |
| ------ | -------------------------------- | --------------------------------------- | ----------------------------------- | -------------------------- |
| POST   | `/units/:id/members`             | Upsert membership (assign user to unit) | `{ userId: string, role?: string }` | 201 `UnitMembership` / 400 |
| GET    | `/units/:id/members`             | List members (includes user basic)      | –                                   | 200 `[UnitMembership[]]`   |
| DELETE | `/units/:unitId/members/:userId` | Remove membership                       | –                                   | 204                        |

#### Example

Add user to unit as secretary:

```bash
curl -X POST http://localhost:3001/units/UNIT_ID/members \
  -H 'Content-Type: application/json' \
  -d '{"userId":"USER_ID","role":"SECRETARY"}'
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

### Roadmap (Planned API Resources)

These are not yet implemented but referenced in user stories & data model:

- Contact Logs: `POST /contact-logs`, `GET /mentees/:id/contact-logs`
- Mentor Links: explicit endpoints to link/unlink mentor & mentee
- Practice Status: `GET/PUT /users/:id/practice` for regularity updates
- Initiations: CRUD for initiation records
- Lesson Progress: `POST /lessons`, `GET /users/:id/lessons`
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

- 2025-09-04: Initial documentation draft.

---

_Last updated: 2025-09-04_
