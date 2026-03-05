'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Settings, Shield, Bell, Moon, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { LanguageCode } from '@/lib/translations';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [isDark, setIsDark] = useState(false);
  const [isSmartAnalysisEnabled, setIsSmartAnalysisEnabled] = useState(true);
  const { language, setLanguage, t, isRTL } = useLanguage();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const smartAnalysis = localStorage.getItem('smart_analysis_enabled');
    if (smartAnalysis !== null) {
      setIsSmartAnalysisEnabled(smartAnalysis === 'true');
    }

    const handleStorage = () => {
      const theme = localStorage.getItem('theme');
      setIsDark(theme === 'dark');
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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
    window.dispatchEvent(new Event('storage'));
  };

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'zh', label: '中文' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#E65100] dark:bg-zinc-950 text-black dark:text-white transition-colors duration-500">
      {/* App Bar */}
      <div className="flex items-center gap-4 p-6 bg-black/10 backdrop-blur-sm sticky top-0 z-10 border-b border-white/10">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
          {isRTL ? <ChevronLeft className="w-6 h-6 rotate-180" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        <h1 className="text-2xl font-black tracking-tight text-white">{t.settings}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Language Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-white/50 uppercase tracking-widest px-2 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t.language}
          </h3>
          
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-lg border border-black/5 dark:border-white/5">
            <div className="p-2 grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center justify-center p-4 rounded-2xl font-bold transition-all ${
                    language === lang.code 
                      ? 'bg-[#E65100] text-white shadow-lg' 
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* System Preferences */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-white/50 uppercase tracking-widest px-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {t.system_preferences}
          </h3>
          
          <div className="bg-white dark:bg-zinc-900 rounded
