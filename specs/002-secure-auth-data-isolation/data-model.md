# Data Model: Secure Authentication & User-Scoped Data for Todo App

## Entities

### User
Represents a registered user in the system with a unique identifier.

**Fields:**
- `id` (string): Unique identifier for the user (UUID or similar)
- `email` (string): User's email address (unique)
- `name` (string): User's display name
- `created_at` (datetime): Timestamp when user account was created
- `updated_at` (datetime): Timestamp when user account was last updated

**Relationships:**
- One-to-many with Task (one user can have many tasks)

### Task
Represents a todo item that is owned by exactly one user.

**Fields:**
- `id` (string): Unique identifier for the task (UUID or similar)
- `title` (string): Title or description of the task
- `description` (string, optional): Detailed description of the task
- `completed` (boolean): Status indicating if the task is completed
- `user_id` (string): Foreign key linking to the owning user
- `created_at` (datetime): Timestamp when task was created
- `updated_at` (datetime): Timestamp when task was last updated

**Validation Rules:**
- `title` is required and must be between 1-255 characters
- `user_id` must reference a valid user
- `completed` defaults to false

**State Transitions:**
- `completed` can transition from `false` to `true` (complete task)
- `completed` can transition from `true` to `false` (reopen task)

## Relationships

### User → Task
- One-to-many relationship
- A user can own zero or more tasks
- Tasks are deleted when the owning user is deleted (cascade delete)

## Constraints

### Data Integrity
- Each task entity MUST be owned by exactly one user (DIR-001)
- Database access MUST be scoped to the authenticated user (DIR-002)
- All data mutations MUST be transactional (DIR-003)
- Persistent storage MUST be used (no in-memory state for critical data) (DIR-004)
- SQLModel queries MUST enforce user_id filtering on all task operations (DIR-005)

### Security
- User ID in JWT MUST match requested resource ownership (SR-003)
- System MUST prevent cross-user data access (SR-005)
- User identity information MUST come exclusively from the validated JWT (SR-008)