import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lextriq — The AI Prompt Library",
    template: "%s | Lextriq",
  },
  description:
    "Discover, share, and upload AI prompts with real results. The community-driven prompt library for ChatGPT, Claude, Midjourney, and more.",
  keywords: [
    "AI prompts",
    "prompt library",
    "ChatGPT",
    "Claude",
    "Midjourney",
    "prompt engineering",
  ],
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${dmSans.variable} antialiased`}
      >
        <NextTopLoader
          color="#8B5CF6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #8B5CF6,0 0 5px #8B5CF6"
        />
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                color: "#1A1A2E",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
