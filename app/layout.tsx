"use client"; // Mark as a client component

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "../provider/AppStates"; // Import AppContextProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Removed the export const metadata declaration from this client component
// Metadata can be defined in a Server Component layout/page, or dynamically handled.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap children with AppContextProvider */}
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
