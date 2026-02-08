'use client';

import React, { useState } from 'react';
import ChatbotPanel from './ChatbotPanel';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 z-50 transition-transform duration-300 transform hover:scale-110"
          aria-label="Open chatbot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <ChatbotPanel onClose={toggleChatbot} />
      )}
    </>
  );
};

export default ChatbotButton;