# Data Model: Multi-User Todo Application with JWT Authentication

## Entities

### User
Represents an authenticated user account, uniquely identified by user ID

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for the user
- `email` (String, Unique, Required): User's email address
- `hashed_password` (String, Required): BCrypt hashed password
- `first_name` (String, Optional): User's first name
- `last_name` (String, Optional): User's last name
- `created_at` (DateTime, Required): Timestamp when user was created
- `updated_at` (DateTime, Required): Timestamp when user was last updated
- `is_active` (Boolean, Default: True): Whether the account is active

**Validation rules**:
- Email must be a valid email format
- Email must be unique across all users
- Password must meet minimum strength requirements
- First and last names must not exceed 50 characters each

### Todo Task
Represents a task item with title, description, completion status, and user ownership

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for the task
- `title` (String, Required): Title of the task (max 200 chars)
- `description` (Text, Optional): Detailed description of the task
- `is_completed` (Boolean, Default: False): Whether the task is completed
- `user_id` (UUID, Foreign Key): Reference to the owning user
- `created_at` (DateTime, Required): Timestamp when task was created
- `updated_at` (DateTime, Required): Timestamp when task was last updated
- `due_date` (DateTime, Optional): Optional deadline for the task

**Validation rules**:
- Title must be between 1 and 200 characters
- User ID must reference an existing, active user
- Description must not exceed 1000 characters
- Due date cannot be in the past (optional validation)

## Relationships

### User → Todo Task (One-to-Many)
- A user can own many todo tasks
- Each todo task belongs to exactly one user
- Foreign key constraint: `todo_tasks.user_id` references `users.id`
- Cascade delete: When a user is deleted, all their tasks are also deleted

## State Transitions

### Todo Task States
- **Pending**: `is_completed = False` (default state)
- **Completed**: `is_completed = True` (after toggling completion status)

### Valid Transitions
- Pending → Completed (via toggle completion endpoint)
- Completed → Pending (via toggle completion endpoint)

## Database Indexes

### Users Table
- Primary index on `id`
- Unique index on `email`
- Index on `is_active` for filtering

### Todo Tasks Table
- Primary index on `id`
- Index on `user_id` for efficient user-based queries
- Index on `is_completed` for filtering completed tasks
- Composite index on (`user_id`, `is_completed`) for combined filtering

## Constraints

### Referential Integrity
- `todo_tasks.user_id` must reference an existing `users.id`
- Prevent orphaned tasks without a valid user owner

### Data Integrity
- All required fields must be present
- Email uniqueness constraint
- User account must be active to create new tasks
- Prevent cross-user data access at the database level (enforced by application logic)

## Security Considerations

### Row-Level Security
- Application-level enforcement to ensure users can only access their own tasks
- All queries must be scoped by the authenticated user's ID
- No direct access to tasks belonging to other users