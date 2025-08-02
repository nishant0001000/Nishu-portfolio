import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import LenisProvider from "@/components/ui/lenis-provider";
import Navbar from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/footer";
import { TextScrollDemo } from "@/components/homeCards/TextScroll";
import { MouseTrailDemo } from "@/components/homeCards/FlipLink";
import { AnimatedLine } from "@/components/ui/animated-line";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nishant Mogahaa",
  description: "Nishant Mogahaa Portfolio",
  icons: {
    icon: [
      {
        url: "/images/favicon.svg",
        sizes: "any",
      },
      {
        url: "/images/favicon.svg",
        sizes: "32x32",
        type: "image/svg+xml",
      },
    ],
    apple: "/images/favicon.svg",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
        attribute="class"
            defaultTheme="system"
            enableSystem
        >
          <LenisProvider>
            <Navbar />
            {children}
            <TextScrollDemo/>
            <MouseTrailDemo/>
            <AnimatedLine className="mb-[-0.8rem]" />
            <Footer/>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
