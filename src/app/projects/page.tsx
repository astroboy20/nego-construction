import type { Metadata } from "next";
import ProjectsClient from "./projects-client";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore NEGO Construction's portfolio — infrastructure, road works, residential estates, healthcare facilities and commercial buildings delivered across Nigeria.",
  alternates: {
    canonical: "https://www.negoconstruction.com/projects",
  },
  openGraph: {
    title: "Projects | NEGO Construction",
    description:
      "26 projects delivered across Nigeria. Infrastructure, road works, residential estates, healthcare and commercial buildings — built with clarity, care and craft.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NEGO Construction projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | NEGO Construction",
    description:
      "26 projects delivered across Nigeria. Infrastructure, road works, residential estates, healthcare and commercial buildings — built with clarity, care and craft.",
    images: ["/opengraph-image"],
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
