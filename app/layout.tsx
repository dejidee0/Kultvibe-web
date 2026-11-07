import { brand } from '@/lib/brand'
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const OG_IMAGE = "https://res.cloudinary.com/dioiyb833/image/upload/f_auto,q_auto,w_1200,h_630,c_limit/v1783692874/kult-vibes-OG_m4yjdw.png";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#08080D",
};

export const metadata: Metadata = {
  title: brand.siteTitle,
  description: brand.siteDescription,
  openGraph: {
    title: brand.siteTitle,
    description: brand.siteDescription,
    url: "https://www.kultvibe.com",
    siteName: brand.name,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: brand.name }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: brand.siteTitle,
    description: brand.siteDescription,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-kv-base text-kv-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
