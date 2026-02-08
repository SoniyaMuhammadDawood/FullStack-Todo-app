'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '@/lib/geminiService';
import { getToolByName } from '@/mcp/tools';
import { parseToolCall, determineAction } from '@/lib/chatbotUtils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotPanel = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! I\'m your AI assistant. How can I help you today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  //....
  const isTaskRelatedQuery = (query: string): boolean => {
    const taskRelatedKeywords = [
      'task', 'todo', 'to-do', 'item', 'work', 'job', 'assignment', 'activity',
      'project', 'chore', 'errand', 'duty', 'responsibility', 'agenda', 'list'
    ];

    const lowerQuery = query.toLowerCase();
    return taskRelatedKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  const handleSend = async () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // First, check if the query is task-related
      if (!isTaskRelatedQuery(inputValue)) {
        // Add error message for non-task related queries
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I can only help with task management. Please ask about adding, updating, completing, or deleting tasks.',
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      // Check if the user input directly corresponds to an action
      const action = determineAction(inputValue);

      if (action) {
        // Execute the determined action directly
        const tool = getToolByName(action.action);

        if (tool) {
          try {
            // Prepare arguments based on action type
            let result;

            if (action.action === 'add_task') {
              result = await tool.execute(action.params);
            } else if (action.action === 'update_task') {
              const { taskId, ...updateParams } = action.params;
              // Only pass taskId and updateParams if taskId exists
              if (taskId) {
                result = await tool.execute(taskId, updateParams);
              } else {
                // If no task ID is provided, ask the user for clarification
                throw new Error('Task ID is required to update a task. Please specify which task you want to update (e.g., "Update task 1 to have high priority").');
              }
            } else if (action.action === 'delete_task') {
              const { taskId } = action.params;
              // Only execute if taskId exists
              if (taskId) {
                result = await tool.execute(taskId);
              } else {
                // If no task ID is provided, ask the user for clarification
                throw new Error('Task ID is required to delete a task. Please specify which task you want to delete (e.g., "Delete task 1").');
              }
            } else if (action.action === 'complete_task') {
              const { taskId, completed } = action.params;
              // Only execute if taskId exists
              if (taskId) {
                result = await tool.execute(taskId, completed);
              } else {
                // If no task ID is provided, ask the user for clarification
                const actionText = completed ? 'complete' : 'mark as incomplete';
                throw new Error(`Task ID is required to ${actionText}. Please specify which task you want to ${actionText} (e.g., "Complete task 1").`);
              }
            } else if (action.action === 'read_task') {
              const { taskId } = action.params;
              // Pass taskId if it exists, otherwise call without arguments to get all tasks
              result = taskId ? await tool.execute(taskId) : await tool.execute();
            } else {
              // For other actions, pass all params
              result = await tool.execute(...Object.values(action.params));
            }

            // Format the result message based on the action type
            let resultMessage = '';
            if (action.action === 'add_task') {
              resultMessage = `Task added successfully: "${result.title}"`;
            } else if (action.action === 'update_task') {
              resultMessage = `Task updated successfully: "${result.title}"`;
            } else if (action.action === 'delete_task') {
              resultMessage = `Task deleted successfully.`;
            } else if (action.action === 'complete_task') {
              resultMessage = `Task marked as ${result.completed ? 'complete' : 'incomplete'}: "${result.title}"`;
            } else if (action.action === 'read_task') {
              if (Array.isArray(result)) {
                if (result.length === 0) {
                  resultMessage = 'No tasks found.';
                } else {
                  resultMessage = `Found ${result.length} task(s):\n${result.map((task: any) => `- ${task.title} (${task.completed ? '✓' : '○'})`).join('\n')}`;
                }
              } else {
                resultMessage = `Task found: "${result.title}" (${result.completed ? 'Completed' : 'Pending'})`;
              }
            } else {
              resultMessage = `Task operation completed: ${JSON.stringify(result)}`;
            }

            // Add tool result message
            const toolResultMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: resultMessage,
              sender: 'bot',
              timestamp: new Date()
            };

            setMessages(prev => [...prev, toolResultMessage]);
          } catch (toolError) {
            console.error('Error executing tool:', toolError);

            // Add error message
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: `Error executing task: ${(toolError as Error).message}`,
              sender: 'bot',
              timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
          }
        } else {
          // Add error message if tool not found
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: `Unknown action: ${action.action}`,
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, errorMessage]);
        }
      } else {
        // Call Gemini API to process the user's request
        const geminiResponse = await sendMessageToGemini(inputValue);

        // Check if the response contains a tool call
        const toolCall = parseToolCall(geminiResponse);

        if (toolCall) {
          // Execute the tool call
          const tool = getToolByName(toolCall.name);

          if (tool) {
            try {
              const result = await tool.execute(...Object.values(toolCall.arguments));

              // Add tool result message
              const toolResultMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `Tool result: ${JSON.stringify(result)}`,
                sender: 'bot',
                timestamp: new Date()
              };

              setMessages(prev => [...prev, toolResultMessage]);
            } catch (toolError) {
              console.error('Error executing tool:', toolError);

              // Add error message
              const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `Error executing tool: ${(toolError as Error).message}`,
                sender: 'bot',
                timestamp: new Date()
              };

              setMessages(prev => [...prev, errorMessage]);
            }
          } else {
            // Add error message if tool not found
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: `Unknown tool: ${toolCall.name}`,
              sender: 'bot',
              timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
          }
        } else {
          // Add bot message with Gemini response
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: geminiResponse,
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botMessage]);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md h-[500px] flex flex-col bg-white rounded-2xl shadow-2xl border-2 border-green-800 z-50 overflow-hidden transform transition-transform duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg">AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-1 focus:outline-none"
          aria-label="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-none'
                  : 'bg-gradient-to-r from-cyan-200 to-cyan-300 text-gray-800 rounded-bl-none'
              } shadow-sm border border-green-800`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-200 to-cyan-300 text-gray-800 rounded-bl-none shadow-sm border border-green-800">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-green-800 p-3 bg-white">
        <div className="flex items-center">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 border border-green-800 rounded-2xl p-3 resize-none h-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`ml-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-2xl shadow-md ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-emerald-600 hover:to-teal-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPanel;