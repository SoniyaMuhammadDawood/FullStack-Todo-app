# Implementation Tasks: Secure Authentication & User-Scoped Data for Todo App

## Feature Overview
Implementation of JWT-based authentication using Better Auth to secure the todo app and enforce user-level data isolation. The solution establishes a secure identity propagation mechanism from Next.js frontend to FastAPI backend, ensuring that users can only access their own tasks.

## Implementation Strategy
- **MVP Scope**: Focus on User Story 1 (Secure User Login and Access) for initial working system
- **Incremental Delivery**: Build functionality in priority order (P1, P2, P3)
- **Parallel Execution**: Identified opportunities for parallel development within user stories
- **Test-Driven Approach**: Validate each user story independently before moving to the next

## Dependencies
- User Story 1 (P1) must be completed before User Story 2 (P2)
- User Story 2 (P2) builds upon User Story 1 (P1)
- User Story 3 (P3) can be implemented in parallel with User Story 2 (P2) but depends on foundational authentication

## Parallel Execution Examples
- Within User Story 1: User model creation can happen in parallel with JWT dependency setup [P]
- Within User Story 2: Create task endpoint can be developed in parallel with update/delete endpoints [P]

---

## Phase 1: Setup

### Goal
Initialize project structure and configure dependencies for JWT-based authentication with user isolation.

- [X] T001 Create backend project structure: backend/src/{models,services,api,__init__.py}
- [X] T002 Install required dependencies: fastapi, sqlmodel, pyjwt, better-auth, asyncpg
- [X] T003 Configure database connection settings for Neon PostgreSQL
- [X] T004 Set up environment variables for BETTER_AUTH_SECRET and database URL

---

## Phase 2: Foundational Components

### Goal
Establish core authentication infrastructure and database models needed for all user stories.

- [X] T005 [P] Create User model in backend/src/models/user.py with id, email, name, timestamps
- [X] T006 [P] Create Task model in backend/src/models/task.py with all required fields and user relationship
- [X] T007 Create database engine and session setup in backend/src/database.py
- [X] T008 Implement JWT verification dependency in backend/src/api/deps.py
- [X] T009 Define CurrentUser Pydantic model in backend/src/api/deps.py
- [X] T010 Create base service layer interface in backend/src/services/__init__.py

---

## Phase 3: User Story 1 - Secure User Login and Access (Priority: P1)

### Goal
Enable users to sign up/log in and securely access only their own tasks. After authenticating, they can view, create, update, and delete their own tasks without seeing anyone else's data.

### Independent Test Criteria
Can be fully tested by registering a user, logging in, creating tasks, and verifying that the user can only see their own tasks and not others' tasks.

- [X] T011 [US1] Create authentication service in backend/src/services/auth.py
- [X] T012 [P] [US1] Implement GET /api/tasks endpoint to retrieve user's tasks only
- [X] T013 [P] [US1] Create task service methods for user-scoped queries in backend/src/services/task_service.py
- [ ] T014 [US1] Test that authenticated user can retrieve their own tasks
- [ ] T015 [US1] Verify that user cannot access another user's tasks (returns 401)

---

## Phase 4: User Story 2 - Secure Task Operations (Priority: P2)

### Goal
Allow authenticated users to perform CRUD operations on their own tasks while being prevented from accessing other users' tasks. The system enforces data isolation at the API level.

### Independent Test Criteria
Can be tested by having multiple users create tasks and verifying that each user can only modify their own tasks.

- [ ] T016 [P] [US2] Implement POST /api/tasks endpoint for creating tasks with user ownership
- [ ] T017 [P] [US2] Implement PUT /api/tasks/{task_id} endpoint for updating user's tasks
- [ ] T018 [P] [US2] Implement DELETE /api/tasks/{task_id} endpoint for deleting user's tasks
- [ ] T019 [US2] Implement PATCH /api/tasks/{task_id}/toggle endpoint for toggling completion
- [ ] T020 [US2] Test that authenticated user can create a new task associated with their user ID
- [ ] T021 [US2] Verify that user attempting to update another's task receives 401
- [ ] T022 [US2] Verify that user attempting to delete another's task receives 401

---

## Phase 5: User Story 3 - Unauthenticated Access Prevention (Priority: P3)

### Goal
Ensure that when users attempt to access protected endpoints without a valid JWT token, the system rejects the request with an appropriate error.

### Independent Test Criteria
Can be tested by making requests to protected endpoints without a valid JWT and verifying that they are rejected.

- [ ] T023 [US3] Test that unauthenticated requests to GET /api/tasks return 401
- [ ] T024 [US3] Test that requests with invalid/expired JWT to GET /api/tasks return 401
- [ ] T025 [US3] Test that unauthenticated requests to POST /api/tasks return 401
- [ ] T026 [US3] Test that unauthenticated requests to PUT /api/tasks/{task_id} return 401
- [ ] T027 [US3] Test that unauthenticated requests to DELETE /api/tasks/{task_id} return 401
- [ ] T028 [US3] Test that unauthenticated requests to PATCH /api/tasks/{task_id}/toggle return 401

---

## Phase 6: Polish & Cross-Cutting Concerns

### Goal
Complete the implementation with proper error handling, security measures, and validation.

- [ ] T029 Add proper error handling for JWT expiration in backend/src/api/deps.py
- [ ] T030 Implement validation for task title length (1-255 chars) in backend/src/models/task.py
- [ ] T031 Add database transaction handling for all task operations in backend/src/services/task_service.py
- [ ] T032 Create frontend utility to attach JWT to API requests in frontend/src/utils/auth.js
- [ ] T033 Add comprehensive logging for authentication events
- [ ] T034 Perform security audit of authentication flow
- [ ] T035 Update documentation with authentication implementation details