import './globals.css';
import './theme.css';
import { LanguageProvider } from '../lib/LanguageContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className="bg-gray-100 text-gray-800 dark:bg-black dark:text-gray-200">
        <ErrorBoundary>
          <LanguageProvider>{children}</LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
