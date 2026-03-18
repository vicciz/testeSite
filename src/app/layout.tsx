import "./globals.css";
import Header from "@/src/components/Header";
import NewsletterPopup from "@/src/components/NewsletterPopup";
import type { Metadata } from "next";
import logoTexto from "@/src/public/assets/imagens/logo s texxto.png";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Imbalável | Perfumes e Cosméticos Premium",
    template: "%s | Imbalável",
  },
  description:
    "Curadoria premium de perfumes masculinos, cosméticos e fragrâncias marcantes. Ofertas exclusivas e seleção com alta performance.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Imbalável | Perfumes e Cosméticos Premium",
    description:
      "Curadoria premium de perfumes masculinos, cosméticos e fragrâncias marcantes.",
    url: "/",
    siteName: "Imbalável",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imbalável | Perfumes e Cosméticos Premium",
    description:
      "Curadoria premium de perfumes masculinos, cosméticos e fragrâncias marcantes.",
  },
  icons: {
    icon: logoTexto.src,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Imbalável",
        url: baseUrl,
        logo: `${baseUrl}${logoTexto.src}`,
      },
      {
        "@type": "WebSite",
        name: "Imbalável",
        url: baseUrl,
      },
    ],
  };

  return (
    <html lang="pt-BR">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
         <NewsletterPopup />
        <Header />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
