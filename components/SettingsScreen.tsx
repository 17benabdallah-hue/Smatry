'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Settings, Shield, Bell, Moon, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { LanguageCode } from '@/lib/translations';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [isSmartAnalysisEnabled, setIsSmartAnalysisEnabled] = useState(true);
  const { language, setLanguage, t, isRTL } = useLanguage();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);

    const smartAnalysis = localStorage.getItem('smart_analysis_enabled');
    if (smartAnalysis !== null) setIsSmartAnalysisEnabled(smartAnalysis === 'true');
  }, []);

  useEffect(() => {
    if (isDark === null) return;
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'zh', label: '中文' },
  ];

  if (isDark === null) return null;

  return (
    <div className="flex flex-col h-full bg-[#E65100] dark:bg-zinc-950 text-black dark:text-white transition-colors duration-500">
      {/* App Bar */}
      <div className="flex items-center gap-4 p-6 bg-black/10 backdrop-blur-sm sticky top-0 z-10 border-b border-white/10">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
          {isRTL ? <ChevronLeft className="w-6 h-6 rotate-180" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        <h1 className="text-2xl font-black tracking-tight text-white">{t.settings}</h1>
      </div>

      {/* باقي محتوى الشاشة ... */}
    </div>
  );
};
