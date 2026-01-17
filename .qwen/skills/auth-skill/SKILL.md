---
name: auth-skill
description: Handle secure authentication workflows including signup, signin, password hashing, JWT tokens, and Better Auth integration for backend systems.
---

# Auth Skill – Authentication & Authorization

## Instructions

1. **User Signup**
   - Validate input data (email, username, password)
   - Enforce strong password rules
   - Hash passwords using industry-standard algorithms (bcrypt, argon2)
   - Prevent duplicate accounts
   - Store only hashed passwords, never plaintext

2. **User Signin**
   - Verify credentials securely
   - Use constant-time password comparison
   - Handle invalid login attempts gracefully
   - Support email/username-based login where applicable

3. **Password Security**
   - Use secure hashing (bcrypt / argon2 with proper cost factors)
   - Implement password reset flows using time-limited tokens
   - Never log or expose sensitive credentials
   - Apply rate limiting to auth endpoints

4. **JWT Tokens**
   - Issue access and refresh tokens securely
   - Define clear token expiration policies
   - Embed minimal, non-sensitive claims
   - Verify and decode tokens on protected routes
   - Handle token refresh and revocation logic

5. **Better Auth Integration**
   - Integrate Better Auth for standardized auth flows
   - Align Better Auth configuration with backend auth strategy
   - Ensure compatibility with FastAPI dependency injection
   - Validate Better Auth-issued tokens and sessions

## Best Practices
- Follow zero-trust principles
- Use HTTPS-only cookies where applicable
- Separate authentication from authorization logic
- Apply role-based or permission-based access control
- Keep auth logic isolated and testable
- Log auth events without leaking sensitive data

## Security Considerations
- Protect against brute-force attacks
- Prevent token replay attacks
- Rotate secrets and signing keys periodically
- Avoid long-lived access tokens
- Ensure CORS and CSRF protections where needed

## Example Flow
```text
User Signup → Password Hashing → User Stored in DB
User Signin → Password Verification → JWT Issued
JWT Sent → Protected API Access → Token Validation
Refresh Token → New Access Token Issued
