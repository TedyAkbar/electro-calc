import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ElectroCalc",
  description: "Aplikasi kalkulator teknik modern",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100 min-h-screen flex flex-col md:flex-row`}
      >
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden md:block w-64 border-r border-gray-800 bg-gray-900/50 p-6 flex-shrink-0">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            ElectroCalc
          </h1>
          <BottomNav isDesktop />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto relative px-4 md:px-8 pt-6 md:pt-10 pb-24 md:pb-10 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Nav (hidden on desktop) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
