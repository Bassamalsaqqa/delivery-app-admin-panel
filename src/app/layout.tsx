// src/app/layout.tsx
import '../globals.css';
import { LocaleProvider } from '@/context/LocaleContext';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import ClientLayout from './client-layout';

export const metadata = {
  title: 'Admin Panel',
  description: 'Admin panel for managing users, orders, products and more',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LocaleProvider>
            <ClientLayout>{children}</ClientLayout>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
