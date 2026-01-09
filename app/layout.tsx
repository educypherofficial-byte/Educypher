import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ ADD THIS
import { UserAuthProvider } from "@/providers/UserAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduCypher",
  description: "Learn. Practice. Build your developer identity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          overflow-x-hidden
          bg-neutral-950
          text-white
        `}
      >
        {/* ✅ AUTH PROVIDER MUST WRAP EVERYTHING */}
        <UserAuthProvider>
          {children}
        </UserAuthProvider>
      </body>
    </html>
  );
}
