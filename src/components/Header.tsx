"use client";

import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Sun, Moon, LogOut } from 'lucide-react';
import React from 'react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center gap-4">
        {/* Title or breadcrumbs can go here */}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLanguage}
          className="text-sm px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {language === 'en' ? t('arabic') : t('english')}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {user && (
          <div className="relative group">
            <span className="cursor-pointer flex items-center gap-2">
              {user.name}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </span>
            <div
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;