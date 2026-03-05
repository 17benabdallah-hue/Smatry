'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';
import { ErrorHandlerProvider } from '@/lib/error-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LanguageProvider } from '@/lib/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Smarty - السكرتير الذكي',
  description: 'تطبيق تذكيرات ذكي يعمل بدون انترنت ويحترم خصوصيتك',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const handleError = (error: Error | any) => {
    console.error('Captured by Global ErrorHandler:', error);
    // يمكن هنا استدعاء ErrorReporter أو IndexedDB لحفظ السجلات
  };

  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ErrorHandlerProvider onError={handleError}>
          <ErrorBoundary>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </ErrorBoundary>
        </ErrorHandlerProvider>
      </body>
    </html>
  );
}
