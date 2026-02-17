import type { Metadata } from "next";
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
  themeColor: "#1e3a8a",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
