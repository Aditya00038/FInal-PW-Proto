import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { WalletProvider } from "@/contexts/WalletContext";
import { Toaster } from "@/components/ui/toaster";
import ChatBot from "@/components/chat/ChatBot";
import Script from "next/script";

const inter = { className: "font-sans" };

export const metadata: Metadata = {
  title: "DhanSathi - AI-Powered Financial Management",
  description: "Track your finances with AI-powered insights and secure your savings on the Algorand blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Translate Widget */}
        <Script
          strategy="afterInteractive"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              window.__googleTranslateReady = true;
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletProvider>
            {children}
            <ChatBot />
            <Toaster />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
