# Magic Link Authorization System

## Overview

The magic link authorization system allows authorized users (like acaryas) to create secure invitation links for new users to register accounts. This enables adding temporary, unverified accounts into the system while requiring users to complete the registration process when using the magic link.

## Features

- **Secure Token Generation**: Uses cryptographically secure tokens (cuid)
- **Expiration Control**: Links expire after 7 days
- **One-Time Use**: Each link can only be used once
- **Duplicate Prevention**: Prevents creating multiple active links for the same email
- **Transaction Safety**: Uses database transactions to ensure data consistency
- **Authentication Required**: Only authenticated users can create magic links

## Database Schema

### MagicLinkInvitation Table

```sql
CREATE TABLE "magic_link_invitations" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "magic_link_invitations_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "magic_link_invitations_token_key" ON "magic_link_invitations"("token");

-- Foreign Keys
ALTER TABLE "magic_link_invitations" ADD CONSTRAINT "magic_link_invitations_createdBy_fkey" 
FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

## API Endpoints

### 1. Create Magic Link
**POST** `/auth/create-magic-link`

Creates a new magic link invitation.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "invitee@example.com"
}
```

**Response (201):**
```json
{
  "token": "clxxx...",
  "expiresAt": "2025-09-20T12:00:00.000Z"
}
```

**Error Responses:**
- `400`: User with email already exists
- `401`: Unauthorized (no valid token)

### 2. Get Magic Link Information
**GET** `/auth/magic-link/:token`

Retrieves information about a magic link.

**Response (200):**
```json
{
  "email": "invitee@example.com",
  "expiresAt": "2025-09-20T12:00:00.000Z",
  "createdBy": {
    "spiritualName": "Acarya Name",
    "worldlyName": "John Doe",
    "displayName": "Acarya Name",
    "email": "acarya@example.com"
  }
}
```

**Error Responses:**
- `404`: Invalid magic link
- `410`: Magic link has expired or already been used

### 3. Complete Magic Link Registration
**POST** `/auth/complete-magic-link`

Completes the account creation process using a magic link.

**Request Body:**
```json
{
  "token": "clxxx...",
  "password": "securepassword123",
  "spiritualName": "Spiritual Name",
  "worldlyName": "Worldly Name",
  "preferredName": "Preferred Name"
}
```

**Response (201):**
```json
{
  "token": "jwt-auth-token...",
  "user": {
    "id": "user-id",
    "email": "invitee@example.com",
    "spiritualName": "Spiritual Name",
    "worldlyName": "Worldly Name",
    "preferredName": "Preferred Name",
    "displayName": "Preferred Name"
  }
}
```

**Error Responses:**
- `400`: User with email already exists
- `404`: Invalid magic link
- `410`: Magic link has expired or already been used

## Usage Flow

### For Acaryas (Link Creators)

1. **Authentication**: Acarya logs into the system
2. **Create Invitation**: Uses the magic link creation form
3. **Share Link**: Copies the generated link and shares it with the invitee
4. **Link Format**: `https://app.example.com/magic-link?token=clxxx...`

### For Invitees (New Users)

1. **Receive Link**: Gets the magic link via email or other communication
2. **Click Link**: Opens the magic link in browser
3. **Fill Form**: Enters password and profile information
4. **Account Created**: Account is created and user is automatically logged in

## Security Considerations

### Token Security
- Uses `cuid()` for cryptographically secure token generation
- Tokens are long and unpredictable
- No sensitive information stored in tokens

### Expiration
- Links expire after 7 days
- Expired links cannot be used
- Clear error messages for expired links

### One-Time Use
- Links are marked as used after successful registration
- Used links cannot be reused
- Database transaction ensures atomicity

### Duplicate Prevention
- System checks for existing unused links for the same email
- Returns existing valid link instead of creating duplicate
- Prevents spam and confusion

### Authentication
- Creating magic links requires valid JWT authentication
- Only authorized users can generate invitations
- No public link creation endpoints

## Frontend Components

### MagicLinkCreator Component
React component for acaryas to create magic links:
- Email input validation
- Success/error feedback
- Automatic clipboard copying
- Usage instructions

### MagicLinkPage Component
Registration page for magic link completion:
- Token validation
- Registration form
- Error handling
- Automatic login after registration

## Testing

### Manual Testing
Use the provided test script:
```bash
bun test-magic-link.ts
```

### Demo Page
Visit `/magic-link-demo` to see the complete flow in action.

## Database Migrations

The system includes a migration to add the `magic_link_invitations` table:
```
packages/db/prisma/migrations/[timestamp]_add_magic_link_invitations/migration.sql
```

## Configuration

### Environment Variables
- `JWT_SECRET`: Required for token generation and validation
- `DATABASE_URL`: PostgreSQL connection string

### Link Expiration
Currently set to 7 days. Can be modified in the API endpoint:
```typescript
const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
```

## Future Enhancements

1. **Email Integration**: Automatic email sending with magic links
2. **Rate Limiting**: Prevent abuse of link creation
3. **Admin Dashboard**: Manage and monitor magic link usage
4. **Custom Expiration**: Allow setting custom expiration times
5. **Bulk Invitations**: Create multiple links at once
6. **Link Analytics**: Track click and usage statistics

## Error Handling

The system provides clear error messages for various scenarios:
- Invalid or expired links
- Already used links
- Duplicate email registrations
- Authentication failures
- Network errors

All errors are user-friendly and actionable.