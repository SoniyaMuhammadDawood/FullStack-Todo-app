// mcp/read-task-tool.ts
import axios from 'axios';

export const readTask = async (taskId?: string): Promise<any> => {
  try {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage

    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks`;
    if (taskId) {
      url += `/${taskId}`;
    }

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error reading task(s):', error);
    throw new Error('Failed to read task(s)');
  }
};