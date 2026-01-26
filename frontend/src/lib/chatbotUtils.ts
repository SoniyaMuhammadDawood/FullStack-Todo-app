// src/lib/chatbotUtils.ts
export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
}

/**
 * Extracts task information from user input
 * @param userInput The raw input from the user
 * @returns Object containing extracted task information
 */
export const extractTaskInfo = (userInput: string): { title?: string; description?: string; priority?: 'low' | 'medium' | 'high'; dueDate?: string } => {
  const lowerInput = userInput.toLowerCase();

  // Extract task title (basic implementation.)
  let title = '';

  // Patterns for extracting task info
  const addTaskPatterns = [
    /add.*task.*named[:\s]*"?([^"\n]+)/i,
    /add.*task[:\s]*"?([^"\n]+)/i,
    /create.*task.*named[:\s]*"?([^"\n]+)/i,
    /create.*task[:\s]*"?([^"\n]+)/i,
    /new.*task[:\s]*"?([^"\n]+)/i
  ];

  for (const pattern of addTaskPatterns) {
    const match = userInput.match(pattern);
    if (match) {
      title = match[1].trim();
      break;
    }
  }

  // If we couldn't extract a title, use the whole input (or part of it)
  if (!title) {
    // Clean up the input to get a potential title
    title = userInput.replace(/add|create|task|please|want|to/i, '').trim();
    if (title.startsWith(':')) title = title.substring(1).trim();
  }

  // Extract priority if mentioned
  let priority: 'low' | 'medium' | 'high' | undefined;
  if (lowerInput.includes('high priority') || lowerInput.includes('priority: high')) priority = 'high';
  else if (lowerInput.includes('medium priority') || lowerInput.includes('priority: medium')) priority = 'medium';
  else if (lowerInput.includes('low priority') || lowerInput.includes('priority: low')) priority = 'low';

  // Extract description if mentioned
  let description: string | undefined;
  const descPattern = /(description|desc|note)[:\s]*"?([^"\n.,!?]+)/i;
  const descMatch = userInput.match(descPattern);
  if (descMatch) {
    description = descMatch[2].trim();
  }

  // Extract due date if mentioned
  let dueDate: string | undefined;
  const datePattern = /\b\d{4}-\d{2}-\d{2}\b|\b\d{2}\/\d{2}\/\d{4}\b|\b\d{1,2}\/\d{1,2}\/\d{2}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(st|nd|rd|th)?,?\s+\d{4}\b/i;
  const dateMatch = userInput.match(datePattern);
  if (dateMatch) {
    dueDate = dateMatch[0].trim();
  }

  return {
    title: title || userInput.substring(0, 50), // fallback to first 50 chars if no title found
    description,
    priority,
    dueDate
  };
};

/**
 * Determines if the user wants to perform a specific action based on their input
 * @param userInput The raw input from the user
 * @returns The action type and relevant parameters
 */
export const determineAction = (userInput: string): { action: string; params: Record<string, any> } | null => {
  const lowerInput = userInput.toLowerCase().trim();

  // Extract task name from user input (for cases where user refers to task by name)
  const extractTaskName = (input: string): string | undefined => {
    // Look for patterns like "task named 'title'" or "task called 'title'"
    const namedPattern = /(named|called|titled)[:\s]*"?([^"\n.,!?]+)/i;
    const match = input.match(namedPattern);

    if (match) {
      return match[2].trim();
    }

    // If no explicit naming pattern, try to extract the main task content
    // Remove action words and return what remains
    const cleanedInput = input.replace(/(delete|remove|cancel|eliminate|update|modify|change|edit|complete|finish|done|mark.*as.*complete|mark.*as.*done|show|view|see|display|get|fetch|task|the|a|\d+|#)/gi, '').trim();

    if (cleanedInput && cleanedInput.length > 2) {
      return cleanedInput;
    }

    return undefined;
  };

  // Check for add task request
  if (/(add|create|new)\s+(a\s+)?task/i.test(lowerInput)) {
    const taskInfo = extractTaskInfo(userInput);
    return {
      action: 'add_task',
      params: {
        title: taskInfo.title,
        description: taskInfo.description,
        priority: taskInfo.priority,
        dueDate: taskInfo.dueDate
      }
    };
  }

  // Check for update task request - expanded pattern matching
  const updatePatterns = [
    /(update|modify|change|edit)\s+(the\s+)?task(\s+(\d+|"[^"]+"|'[^']+'))?/i,
    /(update|modify|change|edit).*task.*/i,
    /task.*update/i,
    /change.*task/i
  ];

  for (const pattern of updatePatterns) {
    if (pattern.test(lowerInput)) {
      // Extract task ID using multiple patterns
      const idMatch = lowerInput.match(/task\s+(\d+|"[^"]+"|'[^']+')/i) ||
                      lowerInput.match(/id[:\s]+(\d+|"[^"]+"|'[^']+')/i) ||
                      lowerInput.match(/#(\d+)/i);

      const taskInfo = extractTaskInfo(userInput);
      const taskName = extractTaskName(userInput);

      return {
        action: 'update_task',
        params: {
          taskId: idMatch ? idMatch[1].replace(/['"]/g, '') : taskName,
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
        }
      };
    }
  }

  // Check for delete task request - expanded pattern matching
  const deletePatterns = [
    /(delete|remove|cancel|eliminate)\s+(the\s+)?task(\s+(\d+|"[^"]+"|'[^']+'))?/i,
    /(delete|remove|cancel|eliminate).*task/i,
    /task.*delete/i,
    /remove.*task/i
  ];

  for (const pattern of deletePatterns) {
    if (pattern.test(lowerInput)) {
      // Extract task ID using multiple patterns
      const idMatch = lowerInput.match(/task\s+(\d+|"[^"]+"|'[^']+')/i) ||
                      lowerInput.match(/id[:\s]+(\d+|"[^"]+"|'[^']+')/i) ||
                      lowerInput.match(/#(\d+)/i);

      const taskName = extractTaskName(userInput);

      return {
        action: 'delete_task',
        params: {
          taskId: idMatch ? idMatch[1].replace(/['"]/g, '') : taskName
        }
      };
    }
  }

  // Check for complete/incomplete task request - expanded pattern matching
  const completePatterns = [
    /(complete|finish|done|mark.*as.*complete|mark.*as.*done)\s+(the\s+)?task(\s+(\d+|"[^"]+"|'[^']+'))?/i,
    /(incomplete|undo|reopen|mark.*as.*incomplete|mark.*as.*not.*done)\s+(the\s+)?task(\s+(\d+|"[^"]+"|'[^']+'))?/i,
    /task.*complete/i,
    /complete.*task/i,
    /task.*done/i,
    /done.*task/i
  ];

  for (const pattern of completePatterns) {
    if (pattern.test(lowerInput)) {
      // Determine if the user wants to mark as complete or incomplete
      const isComplete = /(complete|finish|done|mark.*as.*complete|mark.*as.*done)/i.test(lowerInput);
      const isIncomplete = /(incomplete|undo|reopen|mark.*as.*incomplete|mark.*as.*not.*done)/i.test(lowerInput);

      // Extract task ID using multiple patterns
      const idMatch = lowerInput.match(/task\s+(\d+|"[^"]+"|'[^']+')/i) ||
                      lowerInput.match(/id[:\s]+(\d+|"[^"]+"|'[^']+')/i) ||
                      lowerInput.match(/#(\d+)/i);

      const taskName = extractTaskName(userInput);

      return {
        action: 'complete_task',
        params: {
          taskId: idMatch ? idMatch[1].replace(/['"]/g, '') : taskName,
          completed: isIncomplete ? false : isComplete
        }
      };
    }
  }

  // Check for read/list tasks request
  if (/(show|list|view|see|display|get|fetch)\s+(all\s+)?tasks/i.test(lowerInput)) {
    return {
      action: 'read_task',
      params: {}
    };
  }

  // Additional pattern for reading a specific task
  if (/(show|view|see|display|get|fetch)\s+task/i.test(lowerInput)) {
    const idMatch = lowerInput.match(/task\s+(\d+|"[^"]+"|'[^']+')/i) ||
                    lowerInput.match(/id[:\s]+(\d+|"[^"]+"|'[^']+')/i) ||
                    lowerInput.match(/#(\d+)/i);

    const taskName = extractTaskName(userInput);

    return {
      action: 'read_task',
      params: {
        taskId: idMatch ? idMatch[1].replace(/['"]/g, '') : taskName
      }
    };
  }

  return null;
};

/**
 * Parses the Gemini response to detect if it contains a tool call
 * @param response The response from the Gemini API
 * @returns ToolCall object if a tool call is detected, otherwise null
 */
export const parseToolCall = (response: string): ToolCall | null => {
  try {
    // Look for a pattern indicating a tool call in the response
    // This is a simplified version - in a real implementation, you'd have a more sophisticated parser
    const toolCallRegex = /TOOL_CALL:\s*(\w+)\s*\(([^)]*)\)/i;
    const match = response.match(toolCallRegex);

    if (match) {
      const toolName = match[1];
      const argsString = match[2].trim();

      // Parse arguments (simplified parsing)
      let args: Record<string, any> = {};
      if (argsString) {
        try {
          // Try to parse as JSON first
          args = JSON.parse(argsString);
        } catch {
          // If not JSON, try to parse as key=value pairs
          argsString.split(',').forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
              // Try to parse as JSON, otherwise treat as string
              try {
                args[key.trim()] = JSON.parse(value.trim());
              } catch {
                args[key.trim()] = value.trim();
              }
            }
          });
        }
      }

      return {
        name: toolName,
        arguments: args
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing tool call:', error);
    return null;
  }
};