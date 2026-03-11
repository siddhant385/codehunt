import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar";
import "@/lib/env"; // Validate required env vars at startup

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeHunt — AI-Powered Real Estate Intelligence",
  description: "Smart property valuations, investment insights, and market analytics powered by AI agents with tool-calling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< Updated upstream
    <html lang="en">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar
          companyName="CodeHunt"
          links={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Properties', href: '/properties' },
            { label: 'AI Agents', href: '/agents' },
          ]}
          profileButtonLabel="Profile"
        />
        {children}
        <Toaster richColors position="top-right" />
=======
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar
            companyName="CodeHunt"
            links={[
              { label: 'Home', href: '/' },
              { label: 'Properties', href: '/properties' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'AI Agents', href: '/agents' },
            ]}
            profileButtonLabel={profileButtonLabel}
            userEmail={userEmail}
            isLoggedIn={!!user}
          />
          <main className="pt-24 bg-background min-h-screen">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
>>>>>>> Stashed changes
      </body>
    </html>
  );
}
