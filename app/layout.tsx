// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { DM_Sans } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shinkai — Japan Trip Planner",
  description:
    "Plan serene, seasonal Japan trips with smart clustering and iconic highlights.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* Use DM Sans as the actual body font */}
      <body className={`${dmSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
