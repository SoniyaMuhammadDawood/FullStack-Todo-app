// Simple test to validate the determineAction function
// Copy the function logic directly to test it

// Copy the updated determineAction function here
function determineAction(userInput) {
  const lowerInput = userInput.toLowerCase().trim();

  // Check for add task request
  if (/(add|create|new)\s+(a\s+)?task/i.test(lowerInput)) {
    // Simplified extractTaskInfo for testing
    function extractTaskInfo(input) {
      let title = '';
      const addTaskPatterns = [
        /add.*task.*named[:\s]*"?([^"\n]+)/i,
        /add.*task[:\s]*"?([^"\n]+)/i,
        /create.*task.*named[:\s]*"?([^"\n]+)/i,
        /create.*task[:\s]*"?([^"\n]+)/i,
        /new.*task[:\s]*"?([^"\n]+)/i
      ];

      for (const pattern of addTaskPatterns) {
        const match = input.match(pattern);
        if (match) {
          title = match[1].trim();
          break;
        }
      }

      if (!title) {
        title = input.replace(/add|create|task|please|want|to/i, '').trim();
        if (title.startsWith(':')) title = title.substring(1).trim();
      }

      return { title: title || input.substring(0, 50) };
    }

    const taskInfo = extractTaskInfo(userInput);
    return {
      action: 'add_task',
      params: {
        title: taskInfo.title
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

      function extractTaskInfo(input) {
        let title = '';
        const addTaskPatterns = [
          /add.*task.*named[:\s]*"?([^"\n]+)/i,
          /add.*task[:\s]*"?([^"\n]+)/i,
          /create.*task.*named[:\s]*"?([^"\n]+)/i,
          /create.*task[:\s]*"?([^"\n]+)/i,
          /new.*task[:\s]*"?([^"\n]+)/i
        ];

        for (const pattern of addTaskPatterns) {
          const match = input.match(pattern);
          if (match) {
            title = match[1].trim();
            break;
          }
        }

        if (!title) {
          title = input.replace(/add|create|task|please|want|to/i, '').trim();
          if (title.startsWith(':')) title = title.substring(1).trim();
        }

        return { title: title || input.substring(0, 50) };
      }

      const taskInfo = extractTaskInfo(userInput);

      return {
        action: 'update_task',
        params: {
          taskId: idMatch ? idMatch[1].replace(/['"]/g, '') : undefined,
          title: taskInfo.title
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

      return {
        action: 'delete_task',
        params: {
          taskId: idMatch ? idMatch[1].replace(/['"]/g, '') : undefined
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

      return {
        action: 'complete_task',
        params: {
          taskId: idMatch ? idMatch[1].replace(/['"]/g, '') : undefined,
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

    return {
      action: 'read_task',
      params: {
        taskId: idMatch ? idMatch[1].replace(/['"]/g, '') : undefined
      }
    };
  }

  return null;
}

// Test cases for different commands
const testCases = [
  // Add task commands
  { input: "Add a task called 'Buy groceries'", expected: 'add_task' },
  { input: "Create a task to clean the house", expected: 'add_task' },
  { input: "New task: walk the dog", expected: 'add_task' },
  
  // Update task commands
  { input: "Update task 1 to have high priority", expected: 'update_task' },
  { input: "Change task 2 description to 'Updated description'", expected: 'update_task' },
  { input: "Modify task #3 to be marked as complete", expected: 'update_task' },
  { input: "Edit task '4' title to 'Updated title'", expected: 'update_task' },
  
  // Delete task commands
  { input: "Delete task 1", expected: 'delete_task' },
  { input: "Remove task 2", expected: 'delete_task' },
  { input: "Cancel task #3", expected: 'delete_task' },
  { input: "Eliminate task '4'", expected: 'delete_task' },
  
  // Complete task commands
  { input: "Complete task 1", expected: 'complete_task' },
  { input: "Finish task 2", expected: 'complete_task' },
  { input: "Mark task #3 as done", expected: 'complete_task' },
  { input: "Mark task '4' as complete", expected: 'complete_task' },
  
  // Incomplete task commands
  { input: "Mark task 1 as incomplete", expected: 'complete_task' },
  { input: "Undo task 2 completion", expected: 'complete_task' },
  { input: "Reopen task #3", expected: 'complete_task' },
  { input: "Mark task '4' as not done", expected: 'complete_task' },
  
  // Read task commands
  { input: "Show all tasks", expected: 'read_task' },
  { input: "List all tasks", expected: 'read_task' },
  { input: "View task 1", expected: 'read_task' },
  { input: "Get task #2", expected: 'read_task' },
  { input: "Display task '3'", expected: 'read_task' },
  
  // Random text that shouldn't trigger an action
  { input: "Hello, how are you?", expected: null },
  { input: "What's the weather like?", expected: null },
  { input: "Tell me a joke", expected: null }
];

console.log('Testing chatbot command recognition...\n');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  const result = determineAction(testCase.input);
  const action = result ? result.action : null;
  const passed = action === testCase.expected;
  
  console.log(`Test ${index + 1}: "${testCase.input}"`);
  console.log(`  Expected: ${testCase.expected}, Got: ${action} - ${passed ? 'PASS' : 'FAIL'}`);
  console.log('');
  
  if (passed) {
    passedTests++;
  }
});

console.log(`\nTest Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log('✅ All tests passed!');
} else {
  console.log(`❌ ${totalTests - passedTests} tests failed.`);
}