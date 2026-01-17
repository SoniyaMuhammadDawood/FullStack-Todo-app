---
id: 1
title: secure-auth-data-isolation-tasks
stage: tasks
date_iso: 2026-01-10
surface: agent
model: Qwen
feature: secure-auth-data-isolation
branch: 002-secure-auth-data-isolation
user: user
command: /sp.tasks
labels:
  - authentication
  - security
  - jwt
  - data-isolation
  - tasks
links:
  spec: ../spec.md
  plan: ../plan.md
  ticket: null
  adr: null
  pr: null
files_yaml:
  - specs/002-secure-auth-data-isolation/tasks.md
tests_yaml: []
---

# Implementation Tasks for Secure Authentication & User-Scoped Data

## Prompt Text

```
Context for task generation: /sp.task Goal: Stabilize the FastAPI backend so it can: - Connect to Neon PostgreSQL using an async driver - Create and persist all database tables - Load without import errors - Enforce JWT-based user isolation - Serve the Todo API reliably This spec focuses ONLY on backend correctness and database integrity. --- Scope of Work 1. Database Connectivity (Neon + Async SQLModel) - Use postgresql+asyncpg:// for DATABASE_URL - Remove psycopg2 usage entirely - Use SQLAlchemy AsyncEngine - Ensure SQLModel works with AsyncSession 2. Schema & Tables Must exist in Neon: - users - todos Tables must be auto-created on application startup via: SQLModel.metadata.create_all() 3. Data Ownership Every todo row must contain: - id - title - completed - owner_id (FK → users.id) Every query must filter by owner_id from the JWT 4. Authentication Backend must: - Accept JWT issued by Better Auth - Validate signature using BETTER_AUTH_SECRET - Extract: - user id - email Reject: - Missing token - Invalid token - User ID mismatch 5. API Contract All endpoints must be protected: GET /todos POST /todos GET /todos/{id} PUT /todos/{id} DELETE /todos/{id} PATCH /todos/{id}/complete User id must come ONLY from the JWT, never from URL parameters. 6. Import System Backend must be a real Python package: - All folders must contain __init__.py - No relative imports beyond top-level - Must run with: uvicorn src.main:app 7. Startup Behavior When the server starts: - Connect to Neon - Create missing tables - Log database connection success - Fail fast if DB is unreachable --- Not In Scope - Frontend UI - Styling - Better-Auth setup in Next.js - Deployment --- Completion Criteria - Neon dashboard shows tables `users` and `todos` - Creating a user creates a row in `users` - Creating a todo creates a row in `todos` - Each user only sees their own todos - No psycopg2 errors - No relative import errors - Server runs cleanly with: uvicorn src.main:app --reload
```

## Response Text

Generated comprehensive implementation tasks for the secure authentication and user-scoped data feature. The tasks.md file includes:

- 35 specific, actionable tasks organized by phase
- Phase 1: Setup tasks for project initialization
- Phase 2: Foundational components including models and authentication infrastructure
- Phase 3: User Story 1 implementation (Secure User Login and Access)
- Phase 4: User Story 2 implementation (Secure Task Operations)
- Phase 5: User Story 3 implementation (Unauthenticated Access Prevention)
- Phase 6: Polish and cross-cutting concerns

Each task follows the required format with checkboxes, IDs, story labels, and file paths. Parallel execution opportunities are identified with [P] markers. The tasks cover all requirements including JWT authentication, user isolation, database connectivity with Neon PostgreSQL, and secure API endpoints.

## Outcome

Successfully created a detailed tasks.md file with 35 specific, actionable tasks organized by user story priority. The tasks cover all requirements for implementing JWT-based authentication with user-scoped data access, including database connectivity, authentication infrastructure, secure API endpoints, and proper authorization checks. The implementation strategy focuses on MVP delivery with User Story 1 as the initial scope, followed by incremental delivery of additional functionality.