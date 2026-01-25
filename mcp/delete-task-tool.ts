// mcp/delete-task-tool.ts
import axios from 'axios';

export const deleteTask = async (taskId: string): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};