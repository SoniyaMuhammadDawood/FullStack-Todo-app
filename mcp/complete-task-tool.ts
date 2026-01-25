// mcp/complete-task-tool.ts
import axios from 'axios';

export const completeTask = async (taskId: string, completed: boolean = true): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage

    const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${taskId}/complete`,
      { completed },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating task completion status:', error);
    throw new Error('Failed to update task completion status');
  }
};