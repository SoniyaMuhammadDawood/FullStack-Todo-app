---
id: 002
title: generate-tasks
stage: tasks
date: 2026-01-09
surface: agent
model: gpt-4
feature: 001-multi-user-todo-auth
branch: 001-multi-user-todo-auth
user: HP
command: /sp.tasks
labels: ["tasks", "planning", "implementation"]
links:
  spec: specs/001-multi-user-todo-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-multi-user-todo-auth/tasks.md
tests:
 - specs/001-multi-user-todo-auth/tasks.md
---

## Prompt

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load design documents**: Read from FEATURE_DIR:
   - **Required**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
   - **Optional**: data-model.md (entities), contracts/ (API endpoints), research.md (decisions), quickstart.md (test scenarios)
   - Note: Not all projects have all documents. Generate tasks based on what's available.

3. **Execute task generation workflow**:
   - Load plan.md and extract tech stack, libraries, project structure
   - Load spec.md and extract user stories with their priorities (P1, P2, P3, etc.)
   - If data-model.md exists: Extract entities and map to user stories
   - If contracts/ exists: Map endpoints to user stories
   - If research.md exists: Extract decisions for setup tasks
   - Generate tasks organized by user story (see Task Generation Rules below)
   - Generate dependency graph showing user story completion order
   - Create parallel execution examples per user story
   - Validate task completeness (each user story has all needed tasks, independently testable)

4. **Generate tasks.md**: Use `.specify/templates/tasks-template.md` as structure, fill with:
   - Correct feature name from plan.md
   - Phase 1: Setup tasks (project initialization)
   - Phase 2: Foundational tasks (blocking prerequisites for all user stories)
   - Phase 3+: One phase per user story (in priority order from spec.md)
   - Each phase includes: story goal, independent test criteria, tests (if requested), implementation tasks
   - Final Phase: Polish & cross-cutting concerns
   - All tasks must follow the strict checklist format (see Task Generation Rules below)
   - Clear file paths for each task
   - Dependencies section showing story completion order
   - Parallel execution examples per story
   - Implementation strategy section (MVP first, incremental delivery)

5. **Report**: Output path to generated tasks.md and summary:
   - Total task count
   - Task count per user story
   - Parallel opportunities identified
   - Independent test criteria for each story
   - Suggested MVP scope (typically just User Story 1)
   - Format validation: Confirm ALL tasks follow the checklist format (checkbox, ID, labels, file paths)

Context for task generation: 

The tasks.md should be immediately executable - each task must be specific enough that an LLM can complete it without additional context.

## Task Generation Rules

**CRITICAL**: Tasks MUST be organized by user story to enable independent implementation and testing.

**Tests are OPTIONAL**: Only generate test tasks if explicitly requested in the feature specification or if user requests TDD approach.

### Checklist Format (REQUIRED)

Every task MUST strictly follow this format:

```text
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Format Components**:

1. **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
2. **Task ID**: Sequential number (T001, T002, T003...) in execution order
3. **[P] marker**: Include ONLY if task is parallelizable (different files, no dependencies on incomplete tasks)
4. **[Story] label**: REQUIRED for user story phase tasks only
   - Format: [US1], [US2], [US3], etc. (maps to user stories from spec.md)
   - Setup phase: NO story label
   - Foundational phase: NO story label  
   - User Story phases: MUST have story label
   - Polish phase: NO story label
5. **Description**: Clear action with exact file path

**Examples**:

- ✅ CORRECT: `- [ ] T001 Create project structure per implementation plan`
- ✅ CORRECT: `- [ ] T005 [P] Implement authentication middleware in src/middleware/auth.py`
- ✅ CORRECT: `- [ ] T012 [P] [US1] Create User model in src/models/user.py`
- ✅ CORRECT: `- [ ] T014 [US1] Implement UserService in src/services/user_service.py`
- ❌ WRONG: `- [ ] Create User model` (missing ID and Story label)
- ❌ WRONG: `T001 [US1] Create model` (missing checkbox)
- ❌ WRONG: `- [ ] [US1] Create User model` (missing Task ID)
- ❌ WRONG: `- [ ] T001 [US1] Create model` (missing file path)

### Task Organization

1. **From User Stories (spec.md)** - PRIMARY ORGANIZATION:
   - Each user story (P1, P2, P3...) gets its own phase
   - Map all related components to their story:
     - Models needed for that story
     - Services needed for that story
     - Endpoints/UI needed for that story
     - If tests requested: Tests specific to that story
   - Mark story dependencies (most stories should be independent)

2. **From Contracts**:
   - Map each contract/endpoint → to the user story it serves
   - If tests requested: Each contract → contract test task [P] before implementation in that story's phase

3. **From Data Model**:
   - Map each entity to the user story(ies) that need it
   - If entity serves multiple stories: Put in earliest story or Setup phase
   - Relationships → service layer tasks in appropriate story phase

4. **From Setup/Infrastructure**:
   - Shared infrastructure → Setup phase (Phase 1)
   - Foundational/blocking tasks → Foundational phase (Phase 2)
   - Story-specific setup → within that story's phase

### Phase Structure

- **Phase 1**: Setup (project initialization)
- **Phase 2**: Foundational (blocking prerequisites - MUST complete before user stories)
- **Phase 3+**: User Stories in priority order (P1, P2, P3...)
  - Within each story: Tests (if requested) → Models → Services → Endpoints → Integration
  - Each phase should be a complete, independently testable increment
- **Final Phase**: Polish & Cross-Cutting Concerns

## Response snapshot

# Tasks: Multi-User Todo Application with JWT Authentication

## Feature Overview

Implement a secure, multi-user todo application with JWT-based authentication using Better Auth. The system will include a Next.js frontend, FastAPI backend, and Neon Serverless PostgreSQL database with strict user isolation. Users will be able to sign up, sign in, and manage their personal todo tasks with proper authentication and authorization on all endpoints.

## Implementation Strategy

The implementation will follow an MVP-first approach, delivering core functionality early and building additional features incrementally. The approach will prioritize security and user isolation from the beginning.

## Dependencies

- User Story 2 (Personal Todo Management) depends on User Story 1 (Authentication) being implemented first
- User Story 3 (Task Completion Toggle) depends on User Story 2 (Todo Management) being implemented first
- All user stories depend on foundational components being in place

## Parallel Execution Opportunities

- Backend and frontend initialization can run in parallel (T003, T004)
- Model creation can run in parallel (T008, T009)
- Service creation can run in parallel (T012, T013, T014)
- Frontend services can run in parallel (T018, T019)
- Auth endpoints can run in parallel (T023, T024)
- Todo endpoints can run in parallel (T030, T031, T032, T033)
- Frontend auth forms can run in parallel (T025, T026)
- Frontend todo components can run in parallel (T034, T035, T036)

## Phase 1: Setup

### Goal
Initialize project structure and dependencies for both frontend and backend applications.

### Independent Test Criteria
Project can be built and basic "Hello World" endpoints can be accessed.

### Tasks

- [ ] T001 Create backend directory structure with src/models, src/services, src/api, src/core directories
- [ ] T002 Create frontend directory structure with src/components, src/pages, src/services, src/lib directories
- [ ] T003 [P] Initialize backend project with requirements.txt containing FastAPI, SQLModel, Neon, Better Auth dependencies
- [ ] T004 [P] Initialize frontend project with package.json containing Next.js 16+, React dependencies
- [ ] T005 Set up database connection configuration for Neon PostgreSQL in backend
- [ ] T006 Configure environment variables for BETTER_AUTH_SECRET and database connection

## Phase 2: Foundational Components

### Goal
Create foundational models, services, and utilities that will be used across all user stories.

### Independent Test Criteria
Models can be created and validated, services can perform basic operations, and authentication utilities can generate/verify JWT tokens.

### Tasks

- [ ] T007 Create base model in backend/src/models/base.py for SQLModel
- [ ] T008 [P] [US1] Create User model in backend/src/models/user.py with all required fields and validation
- [ ] T009 [P] [US2] Create Todo model in backend/src/models/todo.py with all required fields and validation
- [ ] T010 Create authentication dependencies in backend/src/api/deps.py for JWT verification
- [ ] T011 Create security utilities in backend/src/core/security.py for password hashing and JWT handling
- [ ] T012 [P] Create authentication service in backend/src/services/auth.py
- [ ] T013 [P] Create user service in backend/src/services/user_service.py
- [ ] T014 [P] Create todo service in backend/src/services/todo_service.py
- [ ] T015 Create API router in backend/src/api/auth.py for authentication endpoints
- [ ] T016 Create API router in backend/src/api/todos.py for todo endpoints
- [ ] T017 Create main application in backend/src/main.py with all routers
- [ ] T018 [P] Create authentication service in frontend/src/services/auth-service.js
- [ ] T019 [P] Create API service in frontend/src/services/api-service.js for JWT attachment
- [ ] T020 Create authentication context in frontend/src/lib/auth-context.js

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1)

### Goal
A new user can sign up for an account, sign in, and receive a JWT token that authenticates them for subsequent API requests.

### Independent Test Criteria
Can register a new user account, sign in, and receive a valid JWT token that can be used for API requests.

### Acceptance Scenarios
1. Given a user is on the registration page, When they provide valid credentials and submit the form, Then a new account is created and they are logged in.
2. Given a user has an existing account, When they provide correct credentials on the sign-in page, Then they receive a valid JWT token and are authenticated.
3. Given a user has a valid JWT token, When they make API requests, Then the requests are authenticated and authorized.

### Tasks

- [ ] T021 [US1] Create registration page in frontend/src/pages/register/page.js
- [ ] T022 [US1] Create login page in frontend/src/pages/login/page.js
- [ ] T023 [US1] Implement registration endpoint in backend/src/api/auth.py
- [ ] T024 [US1] Implement login endpoint in backend/src/api/auth.py
- [ ] T025 [US1] Create registration form component in frontend/src/components/registration-form.js
- [ ] T026 [US1] Create login form component in frontend/src/components/login-form.js
- [ ] T027 [US1] Test user registration flow with JWT token generation
- [ ] T028 [US1] Test user login flow with JWT token generation

## Phase 4: User Story 2 - Personal Todo Management (Priority: P1)

### Goal
An authenticated user can create, read, update, and delete their own todo tasks, with all operations properly filtered by user ownership.

### Independent Test Criteria
Can have an authenticated user create, view, update, and delete their own tasks without affecting other users' data.

### Acceptance Scenarios
1. Given a user is authenticated, When they create a new todo task, Then the task is saved and associated with their account.
2. Given a user has created todo tasks, When they view their task list, Then they only see tasks associated with their account.
3. Given a user has created todo tasks, When they update or delete a task, Then only their own task is affected.

### Tasks

- [ ] T029 [US2] Create todo list page in frontend/src/pages/dashboard/page.js
- [ ] T030 [US2] Create todo creation endpoint in backend/src/api/todos.py
- [ ] T031 [US2] Create todo retrieval endpoint in backend/src/api/todos.py
- [ ] T032 [US2] Create todo update endpoint in backend/src/api/todos.py
- [ ] T033 [US2] Create todo deletion endpoint in backend/src/api/todos.py
- [ ] T034 [US2] Create todo form component in frontend/src/components/todo-form.js
- [ ] T035 [US2] Create todo list component in frontend/src/components/todo-list.js
- [ ] T036 [US2] Create todo item component in frontend/src/components/todo-item.js
- [ ] T037 [US2] Test todo CRUD operations for authenticated users
- [ ] T038 [US2] Verify user isolation - users can only access their own tasks

## Phase 5: User Story 3 - Task Completion Toggle (Priority: P2)

### Goal
An authenticated user can mark their tasks as complete or incomplete, with the status properly updated in the database.

### Independent Test Criteria
Can have an authenticated user toggle the completion status of their tasks.

### Acceptance Scenarios
1. Given a user has an incomplete task, When they toggle the completion status, Then the task is marked as complete in the database.
2. Given a user has a complete task, When they toggle the completion status, Then the task is marked as incomplete in the database.

### Tasks

- [ ] T039 [US3] Create toggle completion endpoint in backend/src/api/todos.py
- [ ] T040 [US3] Add completion toggle functionality to todo item component in frontend/src/components/todo-item.js
- [ ] T041 [US3] Test task completion toggle functionality
- [ ] T042 [US3] Verify completion status updates correctly in the database

## Phase 6: Polish & Cross-Cutting Concerns

### Goal
Add error handling, validation, authorization checks, documentation, and tests to ensure a production-ready application.

### Independent Test Criteria
All functionality works with proper error handling, security measures are in place, and tests pass.

### Tasks

- [ ] T043 Add proper error handling and validation to all backend endpoints
- [ ] T044 Add proper error handling and user feedback to all frontend components
- [ ] T045 Implement proper authorization checks to prevent cross-user data access
- [ ] T046 Add database indexes as specified in the data model
- [ ] T047 Add comprehensive logging to backend services
- [ ] T048 Create proper documentation for API endpoints
- [ ] T049 Add unit tests for backend services
- [ ] T050 Add integration tests for frontend-backend communication

## MVP Scope

The MVP will include:
- User Story 1: User Registration and Authentication
- User Story 2: Personal Todo Management
- Foundational components required for these stories
- Basic error handling and security measures
- Core tests for the implemented functionality

## Outcome

- ✅ Impact: Created comprehensive task breakdown for multi-user todo app with JWT authentication
- 🧪 Tests: 50 tasks created with proper checklist format
- 📁 Files: tasks.md created with proper structure and organization
- 🔁 Next prompts: Begin implementation with setup phase tasks
- 🧠 Reflection: All user stories mapped to specific implementation tasks with dependencies identified

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All tasks follow required format
- Prompt variant (if applicable): Standard task generation prompt
- Next experiment (smallest change to try): Start with T001-T006 setup tasks