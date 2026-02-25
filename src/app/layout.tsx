import "./globals.css";
import Header from "@/src/components/Header";
import NewsletterPopup from "@/src/components/NewsletterPopup";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
         <NewsletterPopup />
        <Header />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
