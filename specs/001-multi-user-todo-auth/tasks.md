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

- [X] T001 Create backend directory structure with src/models, src/services, src/api, src/core directories
- [X] T002 Create frontend directory structure with src/components, src/pages, src/services, src/lib directories
- [X] T003 [P] Initialize backend project with requirements.txt containing FastAPI, SQLModel, Neon, Better Auth dependencies
- [X] T004 [P] Initialize frontend project with package.json containing Next.js 16+, React dependencies
- [X] T005 Set up database connection configuration for Neon PostgreSQL in backend
- [X] T006 Configure environment variables for BETTER_AUTH_SECRET and database connection

## Phase 2: Foundational Components

### Goal
Create foundational models, services, and utilities that will be used across all user stories.

### Independent Test Criteria
Models can be created and validated, services can perform basic operations, and authentication utilities can generate/verify JWT tokens.

### Tasks

- [X] T007 Create base model in backend/src/models/base.py for SQLModel
- [X] T008 [P] [US1] Create User model in backend/src/models/user.py with all required fields and validation
- [X] T009 [P] [US2] Create Todo model in backend/src/models/todo.py with all required fields and validation
- [X] T010 Create authentication dependencies in backend/src/api/deps.py for JWT verification
- [X] T011 Create security utilities in backend/src/core/security.py for password hashing and JWT handling
- [X] T012 [P] Create authentication service in backend/src/services/auth.py
- [X] T013 [P] Create user service in backend/src/services/user_service.py
- [X] T014 [P] Create todo service in backend/src/services/todo_service.py
- [X] T015 Create API router in backend/src/api/auth.py for authentication endpoints
- [X] T016 Create API router in backend/src/api/todos.py for todo endpoints
- [X] T017 Create main application in backend/src/main.py with all routers
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