# Quickstart Guide: Frontend JWT Integration

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Python 3.11+ for backend
- Access to Neon Serverless PostgreSQL database
- Better Auth configured with JWT plugin

## Setup Instructions

### 1. Clone and Navigate to Project
```bash
git clone <repository-url>
cd full-stack-todo-app
```

### 2. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend  # or wherever your Next.js app is located
npm install
# or
yarn install
```

### 4. Configure Environment Variables
Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXTAUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_URL=http://localhost:8000
```

Create `.env` in the backend directory:
```env
DATABASE_URL=your-neon-postgres-connection-string
BETTER_AUTH_SECRET=your-super-secret-key-here
```

### 5. Run the Applications

#### Backend (FastAPI server)
```bash
cd backend
uvicorn main:app --reload --port 8000
```

#### Frontend (Next.js development server)
```bash
cd frontend
npm run dev
# or
yarn dev
```

## Key Features Implementation

### 1. User Authentication
- Registration and login handled by Better Auth
- JWT tokens automatically managed
- Protected routes using middleware

### 2. Todo Management
- Create, read, update, delete operations
- Toggle completion status
- All operations require valid JWT

### 3. Security Measures
- JWT validation on all protected endpoints
- User data isolation
- Secure token storage

## API Usage Examples

### Making Authenticated Requests
```javascript
// Example of making an authenticated API call
const response = await fetch('/api/todos', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json'
  }
});
```

### Error Handling
```javascript
// Example of handling API responses
try {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'New Todo' })
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Redirect to login page
      router.push('/login');
    }
    throw new Error('Failed to create todo');
  }
  
  const data = await response.json();
  // Handle successful response
} catch (error) {
  console.error('Error:', error);
}
```

## Running Tests
```bash
# Frontend tests
cd frontend
npm test
# or
yarn test

# Backend tests
cd backend
pytest
```