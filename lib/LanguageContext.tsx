"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { LanguageCode } from "./translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: any;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>("ar");

  // تحديد إذا كان RTL
  const isRTL = language === "ar";

  // ترجمة بسيطة باستخدام ملف translations.ts
  const translations = require("./translations").default;
  const t = translations[language] || translations["ar"];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
