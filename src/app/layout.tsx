import "./globals.css";
import Header from "@/src/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
