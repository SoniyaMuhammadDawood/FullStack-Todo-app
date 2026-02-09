'use client';

import React, { useEffect } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import TaskCard from './tasks/TaskCard';
import TaskModal from './tasks/TaskModal';
import Toast from '@/components/ui/Toast';
import { TaskSkeleton } from './ui/Skeleton';
import SearchInput from './ui/SearchInput';
import FilterControls from './tasks/FilterControls';
import SortControls from './tasks/SortControls';
import LanguageToggle from './ui/LanguageToggle';
import ChatbotButton from '@/components/ui/ChatbotButton';

const DashboardContent = () => {
  const { state, fetchTasks, openModal, closeModal, hideToast } = useTaskContext();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Calculate stats
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = state.tasks.filter(task => task.priority === 'high').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col lg:flex-row justify-between items-center">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('app.title')}
                </h1>
                <p className="text-gray-600 mt-1">{t('app.description')}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700 font-medium">
                Welcome, {user?.username || user?.email}!
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
              
              <div className="w-32">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-blue-600">{totalTasks}</div>
            <div className="text-gray-600 mt-1 text-center">Total Tasks</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-gray-600 mt-1 text-center">Completed</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-yellow-600">{pendingTasks}</div>
            <div className="text-gray-600 mt-1 text-center">Pending</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-red-600">{highPriorityTasks}</div>
            <div className="text-gray-600 mt-1 text-center">High Priority</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('task.title')}</h2>
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
              onClick={() => openModal('add')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {t('task.add')}
            </button>
          </div>

          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <SearchInput className="w-full sm:w-64" />
            <FilterControls />
            <SortControls />
          </div>

          {state.loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <TaskSkeleton count={4} />
            </div>
          ) : state.filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-700">{t('task.noTasks')}</h3>
              <p className="text-gray-500 mt-2">Create your first task to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300">
              {state.filteredTasks.map(task => (
                <div
                  key={task.id}
                  className="transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                >
                  <TaskCard task={task} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={state.modal.isOpen}
        onClose={closeModal}
        type={state.modal.type}
        taskId={state.modal.taskId}
      />

      {/* Toast notification */}
      <Toast toast={state.toast} onClose={hideToast} />

      {/* Chatbot Button */}
      <ChatbotButton />
    </div>
  );
};

export default DashboardContent;