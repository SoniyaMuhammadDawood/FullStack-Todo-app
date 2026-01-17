# Quickstart Guide: Multi-User Todo Application

## Prerequisites

- Node.js 18+ for frontend development
- Python 3.11+ for backend development
- PostgreSQL (or Neon Serverless PostgreSQL account)
- Better Auth account/credentials
- Git for version control

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd full-stack-todo
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the backend server:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend  # or cd ../frontend if you're in the backend directory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Configuration

### Environment Variables

#### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret key for JWT signing
- `BETTER_AUTH_URL`: Base URL for Better Auth
- `FRONTEND_URL`: URL of the frontend application

#### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Base URL for the backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Base URL for Better Auth

## Running the Application

1. Start the backend server (port 8000 by default)
2. Start the frontend server (port 3000 by default)
3. Access the application at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and get JWT token

### Todo Management
- `GET /todos` - Get all user's todo tasks
- `POST /todos` - Create a new todo task
- `GET /todos/{id}` - Get a specific todo task
- `PUT /todos/{id}` - Update a todo task
- `DELETE /todos/{id}` - Delete a todo task
- `PATCH /todos/{id}/toggle-complete` - Toggle completion status

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Deployment

### Backend
The backend is designed to be deployed as a stateless service. Ensure that:
- Environment variables are properly configured
- Database connection pool settings are optimized for your deployment target
- JWT verification secret is securely managed

### Frontend
The frontend can be deployed as a static site. Ensure that:
- Environment variables are set for the production API endpoints
- Authentication redirect URLs are configured for your domain