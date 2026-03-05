import './globals.css';
import './theme.css';
import { LanguageProvider } from '../lib/LanguageContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body>
        <ErrorBoundary>
          <LanguageProvider>{children}</LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
