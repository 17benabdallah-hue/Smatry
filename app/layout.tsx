import "./globals.css";
import "./theme.css";
import { LanguageProvider } from "../lib/LanguageContext";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const metadata = {
  title: "Smarty - السكرتير الذكي",
  description: "تطبيق تذكيرات ذكي يعمل بدون انترنت ويحترم خصوصيتك",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ErrorBoundary>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
