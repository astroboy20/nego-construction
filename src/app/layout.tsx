import { Analytics } from "@vercel/analytics/next";
import { Inter, Space_Grotesk, Geist } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ScrollToTop } from "@/components/scroll-to-top";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEGO Construction Limited",
    template: "%s | NEGO Construction",
  },
  description:
    "NEGO Construction delivers infrastructure, residential and commercial projects across Nigeria with clarity, care and craft.",
  keywords: [
    "construction company Nigeria",
    "engineering construction Lagos",
    "infrastructure development Nigeria",
    "residential construction Lagos",
    "commercial construction Nigeria",
    "NEGO Construction",
    "road construction Nigeria",
    "project management construction",
  ],
  authors: [{ name: "NEGO Construction Limited" }],
  creator: "NEGO Construction Limited",
  metadataBase: new URL("https://negoconstruction.com"),
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://negoconstruction.com",
    siteName: "NEGO Construction Limited",
    title: "NEGO Construction Limited",
    description:
      "NEGO Construction delivers infrastructure, residential and commercial projects across Nigeria with clarity, care and craft.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEGO Construction Limited",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEGO Construction Limited",
    description:
      "NEGO Construction delivers infrastructure, residential and commercial projects across Nigeria with clarity, care and craft.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#004b22",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("bg-background", inter.variable, spaceGrotesk.variable, "font-sans", geist.variable)}
    >
      <body className="font-sans antialiased">
        <ScrollToTop />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
