import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { AuthWrapper } from "@/components/AuthWrapper";

export const metadata: Metadata = {
  title: "Ngekasir",
  description: "Point of Sales Modern & Cepat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="bg-slate-50 text-slate-800 h-screen overflow-hidden flex font-sans">
        <AuthWrapper>
          <Sidebar />
          <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative pb-20 md:pb-0">
            {children}
          </main>
          <BottomNav />
        </AuthWrapper>
      </body>
    </html>
  );
}
