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
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks`, taskData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw new Error('Failed to add task');
  }
};