---
id: 001
title: impl-plan
stage: plan
date: 2026-01-09
surface: agent
model: gpt-4
feature: 001-multi-user-todo-auth
branch: 001-multi-user-todo-auth
user: HP
command: /sp.plan
labels: ["architecture", "planning", "authentication", "jwt"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-multi-user-todo-auth/plan.md
 - specs/001-multi-user-todo-auth/research.md
 - specs/001-multi-user-todo-auth/data-model.md
 - specs/001-multi-user-todo-auth/quickstart.md
 - specs/001-multi-user-todo-auth/contracts/auth-api.yaml
 - specs/001-multi-user-todo-auth/contracts/todos-api.yaml
 - QWEN.md
tests:
 - specs/001-multi-user-todo-auth/contracts/auth-api.yaml
 - specs/001-multi-user-todo-auth/contracts/todos-api.yaml
---

## Prompt

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `.specify/scripts/powershell/setup-plan.ps1 -Json` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template (already copied).

3. **Execute plan workflow**: Follow the structure in IMPL_PLAN template to:
   - Fill Technical Context (mark unknowns as "NEEDS CLARIFICATION")
   - Fill Constitution Check section from constitution
   - Evaluate gates (ERROR if violations unjustified)
   - Phase 0: Generate research.md (resolve all NEEDS CLARIFICATION)
   - Phase 1: Generate data-model.md, contracts/, quickstart.md
   - Phase 1: Update agent context by running the agent script
   - Re-evaluate Constitution Check post-design

4. **Stop and report**: Command ends after Phase 2 planning. Report branch, IMPL_PLAN path, and generated artifacts.

## Phases

### Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Agent context update**:
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType qwen`
   - These scripts detect which AI agent is in use
   - Update the appropriate agent-specific context file
   - Add only new technology from current plan
   - Preserve manual additions between markers

**Output**: data-model.md, /contracts/*, quickstart.md, agent-specific file

## Key rules

- Use absolute paths
- ERROR on gate failures or unresolved clarifications

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.


/sp.plan /sp.plan

Create:
- System architecture sketch covering Frontend (Next.js), Backend (FastAPI), Auth (Better Auth), and Database (Neon PostgreSQL)
- API structure and route mapping for all Todo endpoints
- Authentication flow (JWT issuance, transport, and verification)
- Data model for users and tasks
- Integration flow between frontend and backend

Decisions needing documentation:
- JWT-based auth vs session-based auth (statelessness, scalability)
- Better Auth on frontend vs backend-managed auth
- SQLModel vs raw SQL for database access
- User ID source (JWT claims vs URL path)
- Where authorization is enforced (middleware vs per-route dependency)
- Async vs sync database access

Testing strategy:
- JWT validation tests (valid, expired, missing, invalid signature)
- Authorization tests (cross-user access blocked)
- API contract tests for all endpoints
- Database persistence tests
- Frontend-to-backend integration tests with real tokens

Technical details:
- Follow Spec-Driven Development using Spec-Kit Plus
- Enforce all rules defined in /sp.constitution
- Organize implementation in phases:
  Auth Setup → API Layer → Database Layer → Frontend Integration → End-to-End Validation
- Keep backend stateless and token-driven
- Ensure every request is traceable to an authenticated user

## Response snapshot

# Implementation Plan: Multi-User Todo Application with JWT Authentication

**Branch**: `001-multi-user-todo-auth` | **Date**: 2026-01-09 | **Spec**: [specs/001-multi-user-todo-auth/spec.md](spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a secure, multi-user todo application with JWT-based authentication using Better Auth. The system will include a Next.js frontend, FastAPI backend, and Neon Serverless PostgreSQL database with strict user isolation. Users will be able to sign up, sign in, and manage their personal todo tasks with proper authentication and authorization on all endpoints.

## Technical Context

**Language/Version**: Python 3.11 (Backend), TypeScript/JavaScript (Frontend), SQL for PostgreSQL
**Primary Dependencies**: Next.js 16+ (App Router), FastAPI, SQLModel, Neon Serverless PostgreSQL, Better Auth
**Storage**: Neon Serverless PostgreSQL with SQLModel ORM
**Testing**: pytest for backend, Jest/React Testing Library for frontend
**Target Platform**: Web application (Next.js frontend + FastAPI backend)
**Project Type**: Web application with separate frontend and backend services
**Performance Goals**: <200ms p95 response time for API requests, support 1000+ concurrent users
**Constraints**: <200ms p95 response time, stateless backend, JWT-based authentication
**Scale/Scope**: 10k+ users, multi-tenant data isolation, persistent storage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Verification
- [x] Correctness and consistency across frontend, backend, and database maintained
- [x] Clear separation of concerns (Frontend, Backend, Auth) preserved
- [x] Security-first design with strict user isolation implemented
- [x] Spec-driven and reproducible implementation approach followed
- [x] Maintainability and scalability considerations addressed
- [x] All API behavior follows defined specification
- [x] Authentication enforced on every protected endpoint
- [x] JWT verification deterministic and stateless
- [x] Database access scoped to authenticated user
- [x] Clear request/response schemas with explicit validation
- [x] Technology stack aligns with constraints (Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth)
- [x] Security standards met (JWT validation, user isolation, proper error handling)
- [x] API standards followed (RESTful design, proper HTTP codes, input validation)
- [x] Data integrity rules enforced (ownership, isolation, transactional operations)

### Post-Design Verification
All constitutional requirements remain satisfied after design completion. The implemented architecture with Next.js frontend, FastAPI backend, Better Auth for authentication, and Neon PostgreSQL database fully complies with the specified constraints and security requirements.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── user.py
│   │   ├── todo.py
│   │   └── base.py
│   ├── services/
│   │   ├── auth.py
│   │   ├── user_service.py
│   │   └── todo_service.py
│   ├── api/
│   │   ├── deps.py
│   │   ├── auth.py
│   │   └── todos.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   └── main.py
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── login/
│   │   ├── register/
│   │   └── dashboard/
│   ├── services/
│   │   ├── auth-service.js
│   │   └── api-service.js
│   ├── lib/
│   │   └── auth-context.js
│   └── app/
│       ├── layout.js
│       └── page.js
└── tests/
```

**Structure Decision**: Web application with separate frontend (Next.js) and backend (FastAPI) services to maintain clear separation of concerns between presentation, business logic, and authentication layers.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|

## Outcome

- ✅ Impact: Created comprehensive implementation plan for multi-user todo app with JWT authentication
- 🧪 Tests: API contracts created and validated
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, auth-api.yaml, todos-api.yaml created
- 🔁 Next prompts: /sp.tasks to break plan into tasks
- 🧠 Reflection: All constitutional requirements verified and design completed successfully

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All requirements met
- Prompt variant (if applicable): Standard planning prompt
- Next experiment (smallest change to try): Begin implementation with auth setup