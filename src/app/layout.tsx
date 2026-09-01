import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/query-provider";
import { AuthProvider } from "@/components/auth-provider";
import { PwaProvider } from "@/components/pwa-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sinaptex — Ekosistem Bisnis dan Layanan Cerdas",
  description:
    "Ekosistem Bisnis dan Layanan Cerdas — Platform business matching untuk mencocokkan kebutuhan, penawaran, dan transaksi kemitraan.",
  openGraph: {
    title: "Sinaptex — Ekosistem Bisnis dan Layanan Cerdas",
    description:
      "Ekosistem Bisnis dan Layanan Cerdas — Platform business matching untuk mencocokkan kebutuhan, penawaran, dan transaksi kemitraan.",
    siteName: "Sinaptex",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sinaptex",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <PwaProvider>{children}</PwaProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
