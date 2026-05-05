import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import LandingHeader from "@/components/LandingHeader";
import HashScroll from "@/components/HashScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

export const metadata: Metadata = {
  title: "Rigid Body Dynamics - AI operations for Indian FMCG manufacturers",
  description:
    "AI agents that handle order processing, procurement, production scheduling, and distribution for mid-size Indian FMCG companies. No migration. No new tools. We work with your WhatsApp, Excel, and phone calls.",
  icons: {
    icon: basePath ? `${basePath}/logowithwhitebg.png` : "/logowithwhitebg.png",
  },
  openGraph: {
    title: "Rigid Body Dynamics - AI operations for Indian FMCG manufacturers",
    description:
      "AI agents that handle order processing, procurement, production scheduling, and distribution for mid-size Indian FMCG companies. No migration. No new tools. We work with your WhatsApp, Excel, and phone calls.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Doto:wght,ROND@100..900,0..100&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased font-sans bg-background text-foreground`}
      >
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded focus-visible:bg-accent focus-visible:px-4 focus-visible:py-2 focus-visible:text-accent-foreground"
        >
          Skip to main content
        </a>
        <LandingHeader />
        <HashScroll />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
