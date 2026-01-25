// mcp/add-task-tool.ts
import axios from 'axios';

interface TaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export const addTask = async (taskData: TaskData): Promise<any> => {
  try {
    // Validate required fields
    if (!taskData.title || taskData.title.trim() === '') {
      throw new Error('Task title is required');
    }

    // Get the auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks`, taskData, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error(`Invalid task data: ${error.response.data.detail || 'Bad Request'}`);
      } else if (error.response?.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
    }
    throw new Error('Failed to add task');
  }
};