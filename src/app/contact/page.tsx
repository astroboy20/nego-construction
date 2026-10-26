import type { Metadata } from "next";
import ContactClient from "./client";

export const metadata: Metadata = {
  title: "Contact NEGO Construction",
  description:
    "Get in touch with NEGO Construction. Visit our office, call us or fill out the enquiry form — we are ready to discuss your next project.",
  openGraph: {
    title: "Contact NEGO Construction",
    description:
      "Reach out to NEGO Construction to discuss your infrastructure, residential or commercial project. We are ready to help.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact NEGO Construction Limited",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact NEGO Construction",
    description:
      "Reach out to NEGO Construction to discuss your infrastructure, residential or commercial project.",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
