import "./globals.css";

export const metadata = {
  title: "Smarty",
  description: "تطبيق تذكيرات ذكي يعمل بدون انترنت ويحترم خصوصيتك",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
