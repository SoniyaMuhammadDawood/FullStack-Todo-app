'use client';

import { TaskProvider } from '@/contexts/TaskContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Sidebar from './components/Sidebar';
import '@/../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <AuthProvider>
          <Sidebar />
          <main className="flex-1 ml-64">
            <TaskProvider>
              <LanguageProvider>
                {children}
              </LanguageProvider>
            </TaskProvider>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
