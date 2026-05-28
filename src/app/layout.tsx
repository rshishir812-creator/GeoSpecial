import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Geo Special — See How Places Changed Over Time",
  description:
    "Satellite timelapses, before-and-after comparisons, and AI-powered insights for any location in India. Watch cities, lakes, and forests transform over decades.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Geo Special" },
  openGraph: {
    title: "Geo Special",
    description: "See how your city changed over time. Satellite intelligence for India.",
    type: "website",
    siteName: "Geo Special",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-white">{children}</body>
    </html>
  );
}
