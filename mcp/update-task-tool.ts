// mcp/update-task-tool.ts
import axios from 'axios';

interface TaskUpdateData {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed?: boolean;
}

export const updateTask = async (taskId: string, taskData: TaskUpdateData): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage

    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${taskId}`, taskData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};