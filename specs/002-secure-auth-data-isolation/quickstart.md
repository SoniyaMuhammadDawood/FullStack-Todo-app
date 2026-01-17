# Quickstart Guide: Secure Authentication & User-Scoped Data for Todo App

## Overview
This guide provides a quick overview of how to implement JWT-based authentication with user-scoped data access using Better Auth, Next.js, and FastAPI.

## Prerequisites
- Node.js 18+ for frontend
- Python 3.11+ for backend
- Better Auth configured for the Next.js frontend
- FastAPI backend with SQLModel and Neon PostgreSQL
- Shared BETTER_AUTH_SECRET between frontend and backend

## Implementation Steps

### 1. Configure Better Auth in Next.js Frontend
Set up Better Auth with JWT configuration in your Next.js application:

```javascript
// lib/auth.js
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    jwt({
      secret: process.env.BETTER_AUTH_SECRET,
    }),
  ],
  // other auth config
});
```

### 2. Create JWT Verification Dependency in FastAPI
Create a dependency to verify JWT tokens in your FastAPI backend:

```python
# backend/src/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from pydantic import BaseModel
from typing import Dict, Any

security = HTTPBearer()

class CurrentUser(BaseModel):
    user_id: str
    email: str

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> CurrentUser:
    try:
        # Decode the JWT using BETTER_AUTH_SECRET
        token_data = jwt.decode(
            credentials.credentials,
            key=os.getenv("BETTER_AUTH_SECRET"),
            algorithms=["HS256"]
        )
        
        # Extract user info from token
        user_id = token_data.get("userId")
        email = token_data.get("email")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
            
        return CurrentUser(user_id=user_id, email=email)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
```

### 3. Apply Authentication to Protected Routes
Use the dependency to protect your API endpoints:

```python
# backend/src/api/tasks.py
from fastapi import APIRouter, Depends
from .deps import get_current_user, CurrentUser

router = APIRouter(prefix="/api/tasks")

@router.get("/")
async def get_tasks(current_user: CurrentUser = Depends(get_current_user)):
    # Get tasks for the authenticated user only
    user_tasks = await task_service.get_tasks_by_user_id(current_user.user_id)
    return user_tasks

@router.post("/")
async def create_task(task: TaskCreate, current_user: CurrentUser = Depends(get_current_user)):
    # Create task for the authenticated user
    task_with_owner = TaskCreateWithOwner(**task.dict(), user_id=current_user.user_id)
    return await task_service.create_task(task_with_owner)
```

### 4. Implement User-Scoped Data Access
Ensure all database queries are scoped to the authenticated user:

```python
# backend/src/services/task_service.py
from sqlmodel import select
from ..models.task import Task

async def get_tasks_by_user_id(user_id: str) -> list[Task]:
    # Only return tasks belonging to the authenticated user
    statement = select(Task).where(Task.user_id == user_id)
    result = await session.exec(statement)
    return result.all()

async def get_task_by_id_and_user(task_id: str, user_id: str) -> Task:
    # Ensure user can only access their own tasks
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.exec(statement)
    task = result.first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or access denied"
        )
    
    return task
```

### 5. Forward JWT from Frontend to Backend
Configure your frontend to forward the JWT to your backend API calls:

```javascript
// frontend/src/services/api.js
import { useSession } from "better-auth/react";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Interceptor to attach JWT to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await auth().getTokens();
  if (token?.accessToken) {
    config.headers.Authorization = `Bearer ${token.accessToken}`;
  }
  return config;
});
```

## Testing the Implementation
1. Register a user via Better Auth
2. Log in and obtain JWT
3. Make API requests with JWT in Authorization header
4. Verify that users can only access their own tasks
5. Verify that unauthorized requests return 401

## Security Considerations
- Store BETTER_AUTH_SECRET securely in environment variables
- Use HTTPS in production
- Validate JWT signatures properly
- Never trust user-provided IDs; always use the ID from the JWT
- Implement proper error handling without exposing sensitive information