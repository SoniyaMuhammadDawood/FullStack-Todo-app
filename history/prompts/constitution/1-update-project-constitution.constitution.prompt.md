---
id: 1
title: update-project-constitution
stage: constitution
date: 2026-01-09
surface: agent
model: Qwen
feature: none
branch: main
user: user
command: /sp.constitution
labels: [constitution, spec-driven-development, todo-app]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
tests:
  - none
---

## Prompt

```text
$ARGUMENTS

Project: Todo Full-Stack Web Application (Spec-Driven Development)

Core principles:
- Correctness and consistency across frontend, backend, and database
- Clear separation of concerns (Frontend, Backend, Auth)
- Security-first design with strict user isolation
- Spec-driven and reproducible implementation
- Maintainability and scalability for multi-user usage

Key standards:
- All API behavior must strictly follow the defined specification
- Authentication must be enforced on every protected endpoint
- JWT verification must be deterministic and stateless
- Database access must always be scoped to the authenticated user
- Clear request/response schemas using explicit validation

Technology constraints:
- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT-based)
- Spec-Driven approach: Gemini Code + Spec-Kit Plus

Security standards:
- All API routes require a valid JWT
- JWT signature verified using shared secret (BETTER_AUTH_SECRET)
- User ID in JWT must match requested resource ownership
- Unauthorized requests return HTTP 401
- Forbidden access to other users' data is not permitted under any condition

API standards:
- RESTful endpoint design
- Proper HTTP status codes for all responses
- Input validation using schemas
- Consistent error response format
- Task ownership enforced on create, read, update, delete, and toggle actions

Data integrity rules:
- Each task is owned by exactly one user
- No cross-user data access
- Persistent storage only (no in-memory state)
- All mutations must be transactional

Constraints:
- Must implement all 5 Basic Level Todo features
- Must support multiple users concurrently
- Backend must be stateless
- Frontend and backend deployed as separate services
- Environment-based configuration for secrets

Success criteria:
- All API endpoints protected by JWT authentication
- Users can only see and modify their own tasks
- Frontend successfully attaches JWT to every request
- Backend correctly validates and decodes JWT
- Application functions end-to-end as a secure full-stack system
```

## Response snapshot

Updated the project constitution file and aligned templates with the new principles for the Todo Full-Stack Web Application. Created a comprehensive constitution document that includes core principles, technology constraints, security standards, API standards, data integrity rules, and success criteria. Updated plan, spec, and tasks templates to reflect the new constitutional requirements.

## Outcome

- ✅ Impact: Updated project constitution and aligned templates to enforce security-first, spec-driven development principles
- 🧪 Tests: none
- 📁 Files: Updated constitution.md and 3 template files to align with new principles
- 🔁 Next prompts: /sp.specify to create feature specifications based on the new constitution
- 🧠 Reflection: The constitution now clearly defines security requirements, data isolation, and authentication standards that will guide all future development

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin feature specification using the new constitution guidelines