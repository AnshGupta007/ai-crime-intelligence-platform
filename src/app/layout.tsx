import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "CIPAP — Crime Intelligence & Predictive Analytics Platform",
  description: "AI-powered Crime Intelligence Platform for Karnataka State Police — SCRB, Predictive Policing, Knowledge Graphs & Geo Intelligence",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <Sidebar />
        <main className="ml-[260px] min-h-screen transition-all duration-200">
          {children}
        </main>
      </body>
    </html>
  );
}
