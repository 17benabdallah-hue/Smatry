// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorHandlerProvider } from '@/lib/error-context';
import { LanguageProvider } from '@/lib/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Smarty - السكرتير الذكي',
  description: 'تطبيق تذكيرات ذكي يعمل بدون انترنت ويحترم خصوصيتك',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" className="dark">
      <body className={inter.className}>
        <ErrorHandlerProvider onError={(err) => console.error(err)}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ErrorHandlerProvider>
      </body>
    </html>
  );
}
