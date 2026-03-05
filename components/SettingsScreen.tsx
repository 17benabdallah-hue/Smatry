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

  // تحميل الإعدادات عند أول تشغيل
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';

    setIsDark(isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const smartAnalysis = localStorage.getItem('smart_analysis_enabled');
    if (smartAnalysis !== null) {
      setIsSmartAnalysisEnabled(smartAnalysis === 'true');
    }
  }, []);

  // تحديث الثيم عند تغييره
  useEffect(() => {
    if (isDark === null) return;

    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'zh', label: '中文' },
  ];

  // منع الوميض قبل تحميل الحالة
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
          
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-lg border border-black/5 dark:border-white/5">

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-50 dark:border-white/5">
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                <span className="font-bold text-black dark:text-white">{t.dark_mode}</span>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  isDark ? 'bg-[#E65100]' : 'bg-zinc-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    isDark
                      ? isRTL
                        ? 'left-1'
                        : 'left-7'
                      : isRTL
                        ? 'left-7'
                        : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Smart Analysis */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Sparkles className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                <div className="flex flex-col">
                  <span className="font-bold text-black dark:text-white">{t.smart_analysis}</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    {t.smart_analysis_desc}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  const newState = !isSmartAnalysisEnabled;
                  setIsSmartAnalysisEnabled(newState);
                  localStorage.setItem('smart_analysis_enabled', newState.toString());
                }}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  isSmartAnalysisEnabled ? 'bg-[#E65100]' : 'bg-zinc-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    isSmartAnalysisEnabled
                      ? isRTL
                        ? 'left-1'
                        : 'left-7'
                      : isRTL
                        ? 'left-7'
                        : 'left-1'
                  }`}
                />
              </button>
            </div>

          </div>
        </section>

        <footer className="text-center py-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            {t.app_name} v2.0.0
          </p>
        </footer>

      </div>
    </div>
  );
};
