# API Contracts: Secure Authentication & User-Scoped Data for Todo App

## Overview
This document defines the API contracts for the JWT-based authentication and user-scoped data access feature.

## Authentication Headers
All protected endpoints require the following header:
```
Authorization: Bearer <jwt_token>
```

## Error Responses
Standard error response format for all endpoints:
```json
{
  "detail": "Error message describing the issue"
}
```

## Endpoints

### GET /api/tasks
Retrieve all tasks for the authenticated user.

**Headers:**
- Authorization: Bearer <jwt_token> (required)

**Response Codes:**
- 200: Successfully retrieved tasks
- 401: Unauthorized (invalid or missing JWT)

**Response Body (200):**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string or null",
    "completed": "boolean",
    "user_id": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

### POST /api/tasks
Create a new task for the authenticated user.

**Headers:**
- Authorization: Bearer <jwt_token> (required)

**Request Body:**
```json
{
  "title": "string",
  "description": "string or null"
}
```

**Response Codes:**
- 201: Task created successfully
- 400: Invalid request body
- 401: Unauthorized (invalid or missing JWT)

**Response Body (201):**
```json
{
  "id": "string",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "user_id": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### PUT /api/tasks/{task_id}
Update an existing task for the authenticated user.

**Headers:**
- Authorization: Bearer <jwt_token> (required)

**Path Parameters:**
- task_id: string (the ID of the task to update)

**Request Body:**
```json
{
  "title": "string",
  "description": "string or null",
  "completed": "boolean"
}
```

**Response Codes:**
- 200: Task updated successfully
- 400: Invalid request body
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (attempting to modify another user's task)
- 404: Task not found

**Response Body (200):**
```json
{
  "id": "string",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "user_id": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### DELETE /api/tasks/{task_id}
Delete a task belonging to the authenticated user.

**Headers:**
- Authorization: Bearer <jwt_token> (required)

**Path Parameters:**
- task_id: string (the ID of the task to delete)

**Response Codes:**
- 204: Task deleted successfully
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (attempting to delete another user's task)
- 404: Task not found

### PATCH /api/tasks/{task_id}/toggle
Toggle the completion status of a task for the authenticated user.

**Headers:**
- Authorization: Bearer <jwt_token> (required)

**Path Parameters:**
- task_id: string (the ID of the task to toggle)

**Response Codes:**
- 200: Task toggled successfully
- 401: Unauthorized (invalid or missing JWT)
- 403: Forbidden (attempting to toggle another user's task)
- 404: Task not found

**Response Body (200):**
```json
{
  "id": "string",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "user_id": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Authentication Endpoints
(These would typically be handled by Better Auth, but defined here for completeness)

### POST /api/auth/login
Authenticate user and return JWT token.
(This endpoint would typically be handled by Better Auth)

### POST /api/auth/signup
Register new user and return JWT token.
(This endpoint would typically be handled by Better Auth)

### POST /api/auth/logout
Invalidate JWT token.
(Stateless JWTs mean this is typically handled client-side by discarding the token)