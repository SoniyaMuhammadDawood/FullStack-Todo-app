# API Contracts: Frontend JWT Integration

## Authentication Endpoints

### POST /api/auth/register
Register a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "user_abc123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid input",
  "message": "Email format is invalid or password too weak"
}
```

### POST /api/auth/login
Authenticate user and return JWT token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_abc123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Authentication failed",
  "message": "Invalid email or password"
}
```

## Todo Management Endpoints

### GET /api/todos
Retrieve all todos for the authenticated user

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "todos": [
    {
      "id": "todo_abc123",
      "title": "Complete project",
      "description": "Finish the todo app implementation",
      "completed": false,
      "user_id": "user_abc123",
      "created_at": "2023-01-01T10:00:00Z",
      "updated_at": "2023-01-01T10:00:00Z"
    }
  ]
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

### POST /api/todos
Create a new todo for the authenticated user

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "title": "New task",
  "description": "Task description (optional)"
}
```

**Response (201 Created):**
```json
{
  "todo": {
    "id": "todo_def456",
    "title": "New task",
    "description": "Task description (optional)",
    "completed": false,
    "user_id": "user_abc123",
    "created_at": "2023-01-01T11:00:00Z",
    "updated_at": "2023-01-01T11:00:00Z"
  }
}
```

### PUT /api/todos/{todo_id}
Update an existing todo

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "todo": {
    "id": "todo_def456",
    "title": "Updated task title",
    "description": "Updated description",
    "completed": true,
    "user_id": "user_abc123",
    "created_at": "2023-01-01T11:00:00Z",
    "updated_at": "2023-01-01T12:00:00Z"
  }
}
```

### DELETE /api/todos/{todo_id}
Delete a todo

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (204 No Content)**

**Error Response (404 Not Found):**
```json
{
  "error": "Not found",
  "message": "Todo not found or does not belong to user"
}
```

### PATCH /api/todos/{todo_id}/toggle
Toggle the completion status of a todo

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "todo": {
    "id": "todo_def456",
    "title": "Updated task title",
    "description": "Updated description",
    "completed": false, // toggled from true to false
    "user_id": "user_abc123",
    "created_at": "2023-01-01T11:00:00Z",
    "updated_at": "2023-01-01T13:00:00Z"
  }
}
```