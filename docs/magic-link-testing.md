# Magic Link System Manual Testing Guide

This guide provides comprehensive testing procedures for the magic link authorization system.

## Prerequisites

1. **Database Setup**
   ```bash
   # Start the PostgreSQL database
   cd packages/db
   docker compose up -d db
   ```

2. **Environment Configuration**
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/am-crm-local"
   JWT_SECRET="your-jwt-secret"
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="test"
   AWS_SECRET_ACCESS_KEY="test"
   AWS_BUCKET_NAME="test"
   FRONT_LOCAL_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

3. **Database Migration**
   ```bash
   bun run migrate
   ```

4. **Start the Development Server**
   ```bash
   bun run dev
   ```

## Testing Scenarios

### 1. API Endpoint Testing

You can use the provided `test-magic-link.ts` script:
```bash
bun test-magic-link.ts
```

Or test manually with curl:

#### Create Magic Link (Authenticated)
```bash
# First, get an auth token by registering/logging in
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"acarya@example.com","password":"password123"}'

# Use the returned token to create a magic link
curl -X POST http://localhost:3000/api/auth/create-magic-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"email":"newuser@example.com"}'
```

#### Validate Magic Link
```bash
curl http://localhost:3000/api/auth/magic-link/YOUR_TOKEN
```

#### Complete Magic Link Registration
```bash
curl -X POST http://localhost:3000/api/auth/complete-magic-link \
  -H "Content-Type: application/json" \
  -d '{
    "token":"YOUR_TOKEN",
    "password":"password123",
    "spiritualName":"New User",
    "preferredName":"Preferred Name"
  }'
```

### 2. Frontend Integration Testing

1. **Magic Link Creator Component**
   - Navigate to `/magic-link-demo`
   - Log in as an acarya
   - Enter an email address
   - Click "Create Magic Link"
   - Verify the link is generated and copied to clipboard

2. **Magic Link Registration Flow**
   - Open the generated magic link in a new browser tab/window
   - Fill in the registration form (password, names)
   - Submit the form
   - Verify successful account creation and automatic login

### 3. Security Testing

#### Authentication Requirements
```bash
# Should fail without authentication
curl -X POST http://localhost:3000/api/auth/create-magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

#### Duplicate Email Prevention
```bash
# Should prevent creating magic links for existing users
curl -X POST http://localhost:3000/api/auth/create-magic-link \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"email":"existing@example.com"}'
```

#### One-Time Use
```bash
# Complete the magic link once
curl -X POST http://localhost:3000/api/auth/complete-magic-link \
  -d '{"token":"YOUR_TOKEN","password":"password123"}'

# Try to use the same token again - should fail
curl -X POST http://localhost:3000/api/auth/complete-magic-link \
  -d '{"token":"YOUR_TOKEN","password":"password123"}'
```

#### Token Expiration
- Magic links expire after 7 days
- Test with an expired token (you can manually update the database for testing)

### 4. Database Verification

Connect to the database and verify records:

```sql
-- View magic link invitations
SELECT * FROM magic_link_invitations;

-- View users created via magic links
SELECT u.*, mli.token 
FROM users u 
JOIN magic_link_invitations mli ON u.email = mli.email 
WHERE mli.used_at IS NOT NULL;
```

## Expected Behaviors

### Success Cases
1. ✅ Authenticated user can create magic links for non-existing emails
2. ✅ Magic link provides correct invitation information
3. ✅ Users can successfully register using valid magic links
4. ✅ Users are automatically logged in after registration
5. ✅ Magic links are marked as used after completion

### Error Cases
1. ❌ Non-authenticated users cannot create magic links
2. ❌ Cannot create magic links for existing users
3. ❌ Invalid tokens are rejected
4. ❌ Expired tokens are rejected
5. ❌ Used tokens cannot be reused

## Performance Testing

Test with multiple concurrent requests:
- Create multiple magic links simultaneously
- Complete multiple registrations in parallel
- Verify database consistency under load

## Integration Points

The magic link system integrates with:
1. **Authentication system** - for creating and validating auth tokens
2. **User management** - for account creation
3. **Email system** (future) - for sending magic links
4. **Frontend components** - for UI interactions

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure PostgreSQL is running
   - Verify DATABASE_URL is correct
   - Check if migrations have been applied

2. **Prisma Client Errors**
   - Run `bun run generate` to generate the Prisma client
   - Ensure database schema is up to date

3. **Authentication Failures**
   - Verify JWT_SECRET is set
   - Check token format and expiration

4. **CORS Issues**
   - Ensure frontend and API are running on expected ports
   - Verify CORS configuration in API

## Manual Testing Checklist

- [ ] Database is running and accessible
- [ ] Migrations applied successfully  
- [ ] API server starts without errors
- [ ] Frontend components render correctly
- [ ] Can create magic link (authenticated)
- [ ] Magic link information is retrievable
- [ ] Can complete registration with magic link
- [ ] User is logged in after registration
- [ ] Magic link becomes unusable after use
- [ ] Cannot create magic link for existing user
- [ ] Authentication required for creation
- [ ] Tokens expire correctly
- [ ] Database records are consistent