# Data Model: Frontend JWT Integration

## Entities

### User
Represents an authenticated user with unique identifier, email, and authentication credentials

**Fields:**
- id: string (unique identifier)
- email: string (email address, required, unique)
- name: string (optional, user's display name)
- created_at: datetime (timestamp of account creation)
- updated_at: datetime (timestamp of last update)

**Validation rules:**
- Email must be a valid email format
- Email must be unique across all users
- Required fields must not be empty

**Relationships:**
- One-to-many with Todo items (user owns multiple todos)

### Todo
Represents a task item with title, description, completion status, and ownership tied to a specific user

**Fields:**
- id: string (unique identifier)
- title: string (task title, required)
- description: string (optional, task description)
- completed: boolean (completion status, default: false)
- user_id: string (foreign key to User, required)
- created_at: datetime (timestamp of creation)
- updated_at: datetime (timestamp of last update)

**Validation rules:**
- Title must not be empty
- User_id must reference an existing user
- Completed status must be boolean

**State transitions:**
- Created with completed = false
- Can be updated to completed = true (mark as done)
- Can be updated to completed = false (mark as undone)
- Can be deleted (removed from user's list)

**Relationships:**
- Many-to-one with User (todo belongs to one user)