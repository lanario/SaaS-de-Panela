import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Presentix — Lista de Presentes",
  description: "Crie e gerencie suas listas de presentes com facilidade.",
  metadataBase: new URL(baseUrl),
  icons: {
    icon: [
      { url: "/presentix_logo.png", sizes: "32x32", type: "image/png" },
      { url: "/presentix_logo.png", sizes: "96x96", type: "image/png" },
      { url: "/presentix_logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/presentix_logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Presentix — Lista de Presentes",
    description: "Crie e gerencie suas listas de presentes com facilidade.",
    images: ["/presentix_logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Presentix — Lista de Presentes",
    description: "Crie e gerencie suas listas de presentes com facilidade.",
    images: ["/presentix_logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-white text-gray-800`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
