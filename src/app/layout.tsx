import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Besmak India",
    default: "Besmak India - Precision Manufacturing Solutions",
  },
  description:
    "Besmak India delivers high-quality industrial components, valves, pumps, and custom parts for B2B needs.",
  keywords: ["Industrial", "Manufacturing", "Valves", "Pumps", "Besmak India"],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#284B8C",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

import { Toaster } from "sonner";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import ThemeRegistry from "@/components/layout/ThemeRegistry";
import { getAllSettings } from "@/lib/settings";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAllSettings();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <ThemeRegistry initialSettings={settings} />
        <NextAuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
