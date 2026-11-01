import { Inter, Space_Grotesk, Geist } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ScrollToTop } from "@/components/scroll-to-top";
import { buildOrganizationLD, buildLocalBusinessLD, serializeLD } from "@/lib/json-ld";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { ChatbotGuard } from "@/components/chatbot-guard";
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
  metadataBase: new URL("https://www.negoconstruction.com"),
  alternates: {
    canonical: "https://www.negoconstruction.com",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://www.negoconstruction.com",
    siteName: "NEGO Construction Limited",
    title: "NEGO Construction Limited",
    description:
      "NEGO Construction delivers infrastructure, residential and commercial projects across Nigeria with clarity, care and craft.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NEGO Construction Limited",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@negoconstruction",
    title: "NEGO Construction Limited",
    description:
      "NEGO Construction delivers infrastructure, residential and commercial projects across Nigeria with clarity, care and craft.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#004b22",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgLD = serializeLD(buildOrganizationLD());
  const localBizLD = serializeLD(buildLocalBusinessLD());

  return (
    <html
      lang="en"
      className={cn(
        "bg-background",
        inter.variable,
        spaceGrotesk.variable,
        "font-sans",
        geist.variable
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: orgLD }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: localBizLD }}
        />
      </head>
      <body className="font-sans antialiased">
        <ScrollToTop />
        {children}
        <CookieBanner />
        <ChatbotGuard />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
