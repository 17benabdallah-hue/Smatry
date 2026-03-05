"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { LanguageCode, translations } from "./translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: any;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>("ar");

  // تحميل اللغة من localStorage عند بداية التشغيل
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang as LanguageCode);
  }, []);

  // حفظ اللغة في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const isRTL = language === "ar";
  const t = translations[language] || translations["ar"];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
