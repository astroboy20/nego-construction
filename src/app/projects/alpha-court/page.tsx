import type { Metadata, ResolvingMetadata } from "next";
import { projects } from "@/lib/site-data";
import { buildProjectLD, buildBreadcrumbLD, serializeLD } from "@/lib/json-ld";
import AlphaCourtClient from "./client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  await params;
  const project = projects.find((p) => p.slug === "alpha-court")!;

  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: `https://www.negoconstruction.com/projects/alpha-court`,
    },
    openGraph: {
      title: `${project.name} | NEGO Construction`,
      description: project.description,
      images: [
        {
          url: "/alpha-court-1.jpg",
          width: 1200,
          height: 630,
          alt: `${project.name} — Forthright Estate, Magboro`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | NEGO Construction`,
      description: project.description,
      images: ["/alpha-court-1.jpg"],
    },
  };
}

export default async function AlphaCourtPage({ params }: Props) {
  await params;
  const project = projects.find((p) => p.slug === "alpha-court")!;
  const projectLD = serializeLD(buildProjectLD(project));
  const breadcrumbLD = serializeLD(buildBreadcrumbLD([
    { name: 'Home', url: 'https://www.negoconstruction.com' },
    { name: 'Projects', url: 'https://www.negoconstruction.com/projects' },
    { name: project.name, url: `https://www.negoconstruction.com/projects/${project.slug}` },
  ]));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectLD }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbLD }}
      />
      <AlphaCourtClient />
    </>
  );
}
