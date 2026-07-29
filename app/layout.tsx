import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { MetaPixel } from "@/components/meta-pixel";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Impulso Criativo | Diagnóstico Tributário",
  description:
    "Descubra oportunidades tributárias escondidas na sua empresa com uma análise preliminar do CNPJ em menos de 1 minuto.",
  applicationName: "Impulso Criativo",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Impulso Criativo",
  },
  formatDetection: {
    telephone: false,
    email: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#010D1F" },
    { media: "(prefers-color-scheme: dark)", color: "#010D1F" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${plusJakarta.variable} font-sans antialiased overflow-x-hidden`}
      >
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
