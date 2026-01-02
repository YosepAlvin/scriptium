import type { Metadata } from "next";
import { Playfair_Display, Inter, Libre_Baskerville, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import ChatFloatingButton from "@/components/ChatFloatingButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Scriptum | Premium Minimalist Lifestyle",
    template: "%s | Scriptum"
  },
  description: "Dibuat dengan Niat, Dirancang untuk Warisan. Temukan koleksi pakaian premium dengan estetika minimalis modern.",
  keywords: ["fashion premium", "minimalist style", "pakaian eksklusif", "Scriptum", "lifestyle brand"],
  authors: [{ name: "Scriptum Team" }],
  creator: "Scriptum",
  publisher: "Scriptum",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://scriptum-lifestyle.com"), // Ganti dengan domain asli nanti
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Scriptum | Premium Minimalist Lifestyle",
    description: "Dibuat dengan Niat, Dirancang untuk Warisan. Koleksi pakaian premium minimalis.",
    url: "https://scriptum-lifestyle.com",
    siteName: "Scriptum",
    images: [
      {
        url: "/og-image.jpg", // Pastikan file ini ada di public/
        width: 1200,
        height: 630,
        alt: "Scriptum Lifestyle",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scriptum | Premium Minimalist Lifestyle",
    description: "Koleksi pakaian premium minimalis modern.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${manrope.variable} ${playfair.variable} ${libreBaskerville.variable} font-sans text-foreground bg-background antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <ChatFloatingButton />
        </Providers>
      </body>
    </html>
  );
}
