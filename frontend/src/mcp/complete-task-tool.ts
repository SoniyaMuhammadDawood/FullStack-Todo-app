// mcp/complete-task-tool.ts
import axios from 'axios';

export const completeTask = async (taskId: string, completed: boolean = true): Promise<any> => {
  try {
    // Get the auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    // If taskId looks like a name (contains letters), we need to find the actual task ID first
    if (taskId && /^[a-zA-Z]/.test(taskId)) {
      // First get all tasks to find the matching one
      const allTasksResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      const allTasks = allTasksResponse.data;

      // Find task by exact title match first
      let matchingTask = allTasks.find((task: any) =>
        task.title.toLowerCase().trim() === taskId.toLowerCase().trim()
      );

      // If no exact match, try partial match
      if (!matchingTask) {
        matchingTask = allTasks.find((task: any) =>
          task.title.toLowerCase().includes(taskId.toLowerCase()) ||
          taskId.toLowerCase().includes(task.title.toLowerCase())
        );
      }

      // If still no match, try to find by description
      if (!matchingTask) {
        matchingTask = allTasks.find((task: any) =>
          task.description && task.description.toLowerCase().includes(taskId.toLowerCase())
        );
      }

      if (matchingTask) {
        // Now update the task completion status using the actual ID
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${matchingTask.id}/completion-status`,
          { completed },
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            }
          }
        );

        return response.data;
      } else {
        throw new Error(`Could not find a task with name "${taskId}". Available tasks: ${allTasks.map((t: any) => `"${t.title}"`).join(', ')}`);
      }
    } else {
      // taskId is likely a UUID, proceed normally
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${taskId}/completion-status`,
        { completed },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }
      );

      return response.data;
    }
  } catch (error) {
    console.error('Error updating task completion status:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Task with ID "${taskId}" not found.`);
      } else if (error.response?.status === 400) {
        throw new Error(`Invalid task ID format: "${taskId}".`);
      } else if (error.response?.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
    }
    throw new Error('Failed to update task completion status');
  }
};