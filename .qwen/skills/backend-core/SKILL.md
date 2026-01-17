---
name: backend-skill
description: Generate FastAPI backend routes, handle requests and responses, and connect to databases. Use for REST API development.
---

# Backend Skill

## Instructions

1. **API Routes**
   - Define RESTful endpoints (GET, POST, PUT, DELETE)
   - Follow clear and consistent URL naming conventions
   - Use dependency injection for shared logic
   - Support async endpoints where appropriate

2. **Request & Response Handling**
   - Validate incoming data using Pydantic models
   - Enforce strict request schemas
   - Return structured, predictable response models
   - Use correct HTTP status codes
   - Implement centralized error handling

3. **Database Connectivity**
   - Integrate relational or NoSQL databases
   - Use ORM or query layers (SQLAlchemy, SQLModel, async drivers)
   - Manage database sessions and connections safely
   - Optimize queries and avoid N+1 issues
   - Support migrations and schema evolution

4. **Authentication & Security (When Required)**
   - Integrate JWT, OAuth2, or API key authentication
   - Protect routes with dependencies
   - Secure credentials and environment variables

## Best Practices
- Keep route handlers thin; move logic to services
- Separate API, business logic, and data layers
- Use async I/O for scalability
- Validate both input and output
- Log errors and critical actions consistently
- Document APIs using OpenAPI standards

## Example Structure
```python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

app = FastAPI()

class ItemCreate(BaseModel):
    name: str
    price: float

class ItemResponse(ItemCreate):
    id: int

@app.post("/items", response_model=ItemResponse)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    new_item = Item(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item
