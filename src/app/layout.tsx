import "./globals.css";
import Header from "@/src/components/Header";
import NewsletterPopup from "@/src/components/NewsletterPopup";
import type { Metadata } from "next";
import logoTexto from "@/src/public/assets/imagens/logo s texxto.png";

export const metadata: Metadata = {
  icons: {
    icon: logoTexto.src,
  },
};
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
