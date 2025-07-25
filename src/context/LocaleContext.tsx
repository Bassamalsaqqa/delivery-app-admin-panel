"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/i18n';

interface LocaleContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof (typeof translations)[Language]) => string;
  dir: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const LocaleProvider: React.FC<Props> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // On first load, attempt to read the language from localStorage
    const saved = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    if (saved === 'en' || saved === 'ar') {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    // Persist chosen language
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
    // Set direction on html element
    if (typeof document !== 'undefined') {
      document.documentElement.dir = translations[language].direction as 'ltr' | 'rtl';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: any) => {
    const locale = translations[language] as any;
    return locale[key] ?? key;
  };

  const value: LocaleContextProps = {
    language,
    setLanguage: (lang: Language) => setLanguage(lang),
    t,
    dir: translations[language].direction as 'ltr' | 'rtl',
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};