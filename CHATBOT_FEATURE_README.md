# Todo App with AI Chatbot

This is a full-stack todo application with an integrated AI chatbot that can help manage your tasks using Google's Gemini AI.

## Features

- Manage your tasks (add, update, read, delete, complete)
- AI-powered chatbot assistant that can help with your tasks
- Modern UI with attractive design

## Tech Stack

- Frontend: Next.js 16, React, Tailwind CSS
- Backend: FastAPI, Python
- Database: PostgreSQL (Neon)
- AI Integration: Google Gemini API
- Authentication: Better Auth

## Setup Instructions

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Start both the backend and frontend servers

### Environment Variables

Create a `.env.local` file in the frontend directory with the following:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running the Application

1. Start the backend server:
```bash
cd backend
python main.py
```

2. Start the frontend server:
```bash
cd frontend
npm run dev
```

## Using the AI Chatbot

1. Navigate to the main dashboard
2. Click the chatbot icon in the bottom-right corner
3. Type your request to the AI assistant
4. The AI will process your request and may call appropriate tools to manage your tasks

### Supported Commands

- "Add a task called 'Buy groceries'"
- "Update task 1 to have high priority"
- "Complete task 2"
- "Delete task 3"
- "Show all tasks"

The AI will interpret your natural language and call the appropriate tools to manage your tasks.