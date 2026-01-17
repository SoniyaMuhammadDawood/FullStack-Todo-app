# Research Summary: Secure Authentication & User-Scoped Data for Todo App

## Overview
This document summarizes research conducted for implementing JWT-based authentication using Better Auth to secure the todo app and enforce user-level data isolation.

## Decision: JWT vs Server-Side Sessions
**Rationale**: JWT tokens were chosen over server-side sessions to maintain a stateless backend as required by the specification. Server-side sessions would require storing session state on the backend, violating constraint SR-007 which states "System MUST NOT store session state on the backend". JWTs allow for stateless authentication where user identity is contained within the token itself.

**Alternatives considered**: 
- Server-side sessions with Redis storage
- OAuth 2.0 with authorization server
- Custom token system

## Decision: JWT Verification Location
**Rationale**: JWT verification will occur via FastAPI dependency injection in the form of a dependency that can be added to protected routes. This approach centralizes authentication logic while allowing individual endpoints to access the authenticated user's identity. Using dependencies allows for reusable authentication logic across multiple endpoints.

**Alternatives considered**:
- Middleware approach (rejected because dependencies offer more granular control)
- Manual verification in each endpoint (rejected due to code duplication)

## Decision: User Identity Encoding in JWT
**Rationale**: The Better Auth JWT will contain a `userId` claim that corresponds to the user's unique identifier in the system. This aligns with the requirement that "System MUST extract user_id from the validated JWT and use it for data filtering". Better Auth automatically includes user information in the JWT payload.

**Alternatives considered**:
- Using username instead of user ID (rejected for privacy and consistency reasons)
- Custom claims structure (unnecessary since Better Auth handles this)

## Decision: API Route Authentication Method
**Rationale**: Authentication will be enforced by requiring a valid JWT in the `Authorization: Bearer <token>` header for all protected endpoints. FastAPI dependency will extract and validate the token, making the authenticated user available to the endpoint. This ensures that routes use the authenticated user rather than relying on URL parameters or other inputs.

**Alternatives considered**:
- Cookie-based authentication (rejected to maintain consistency with API-first approach)
- Custom header names (rejected to follow standard practices)

## Decision: SQL Query Ownership Enforcement
**Rationale**: SQLModel queries will be constructed to always filter by the authenticated user's ID. This will be implemented through service layer methods that accept the user ID as a parameter and automatically apply filters to queries. This satisfies requirement DIR-005: "SQLModel queries MUST enforce user_id filtering on all task operations".

**Alternatives considered**:
- Database-level row-level security (overly complex for this implementation)
- Application-level checks after query (security risk if forgotten)

## Best Practices Researched

### JWT Security Best Practices
- Use strong secrets (BETTER_AUTH_SECRET) for signing
- Validate token expiration
- Never store sensitive information in JWT payloads
- Use HTTPS in production
- Implement proper error handling for invalid tokens

### FastAPI Authentication Patterns
- Use Depends() for authentication dependencies
- Implement custom exceptions for authentication failures
- Leverage Pydantic models for token validation
- Use HTTPException with proper status codes (401, 403)

### Better Auth Integration
- Configure JWT plugin appropriately
- Share the same BETTER_AUTH_SECRET between frontend and backend
- Use the auth middleware on the frontend
- Propagate tokens to backend API calls