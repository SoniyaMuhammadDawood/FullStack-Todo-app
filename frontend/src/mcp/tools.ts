// mcp/tools.ts
import { addTask } from './add-task-tool';
import { updateTask } from './update-task-tool';
import { readTask } from './read-task-tool';
import { deleteTask } from './delete-task-tool';
import { completeTask } from './complete-task-tool';

export interface Tool {
  name: string;
  description: string;
  execute: (...args: any[]) => Promise<any>;
}

export const tools: Tool[] = [
  {
    name: 'add_task',
    description: 'Add a new task with title, description, priority, and due date',
    execute: addTask
  },
  {
    name: 'update_task',
    description: 'Update an existing task with id, title, description, priority, and due date',
    execute: updateTask
  },
  {
    name: 'read_task',
    description: 'Read a specific task by id or all tasks if no id provided',
    execute: readTask
  },
  {
    name: 'delete_task',
    description: 'Delete a task by id',
    execute: deleteTask
  },
  {
    name: 'complete_task',
    description: 'Mark a task as complete or incomplete by id',
    execute: completeTask
  }
];

export const getToolByName = (name: string): Tool | undefined => {
  return tools.find(tool => tool.name === name);
};