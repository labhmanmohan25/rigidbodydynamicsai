import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Rigid Body Dynamics AI — AI That Does the Work for You",
  description:
    "We research what's next in AI and make it accessible — one problem at a time. Proactive execution, not just answers.",
  openGraph: {
    title: "Rigid Body Dynamics AI — AI That Does the Work for You",
    description:
      "We research what's next in AI and make it accessible — one problem at a time.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased font-sans`}
      >
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded focus-visible:bg-accent focus-visible:px-4 focus-visible:py-2 focus-visible:text-accent-foreground"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
