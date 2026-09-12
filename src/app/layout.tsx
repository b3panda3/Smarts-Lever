import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/auth/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smarts Lever - Learn In Your Language",
  description:
    "Smarts Lever breaks down complex subjects into vernacular West African languages. Learn Mathematics, Physics, Chemistry and more in Pidgin, Yoruba, Hausa, Twi, Wolof, and other local languages using AI-powered curriculum generation.",
  keywords: [
    "Smarts Lever",
    "vernacular education",
    "West Africa",
    "Pidgin English",
    "Yoruba",
    "Hausa",
    "Twi",
    "Wolof",
    "AI education",
    "Wema Bank",
    "Hackaholics 2026",
    "Social Impact",
    "learning in local language",
  ],
  authors: [{ name: "Smarts Lever Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Smarts Lever - Learn In Your Language",
    description:
      "Breaking down complex subjects into vernacular West African languages with AI.",
    siteName: "Smarts Lever",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smarts Lever - Learn In Your Language",
    description:
      "Breaking down complex subjects into vernacular West African languages with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
