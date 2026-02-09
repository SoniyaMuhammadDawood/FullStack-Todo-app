'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard' },

  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-800 to-indigo-900 text-white shadow-xl z-10">
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold">Todo App</h1>
        <p className="text-blue-200 text-sm">Task Management System</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === item.href 
                    ? 'bg-white/20 text-white font-medium' 
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 bg-blue-900/50 text-center text-xs text-blue-300">
        © {new Date().getFullYear()} Todo App
      </div>
    </aside>
  );
};

export default Sidebar;