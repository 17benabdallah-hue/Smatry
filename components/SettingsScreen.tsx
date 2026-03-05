'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Moon } from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 p-6">
      <button onClick={onBack} className="mb-4">
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
      
      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg">
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5" />
          <span>الوضع الليلي</span>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`w-12 h-6 rounded-full ${isDark ? 'bg-blue-600' : 'bg-gray-400'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full transition-all ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
};
