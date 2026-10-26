import type { Metadata, ResolvingMetadata } from "next";
import { projects } from "@/lib/site-data";
import { buildProjectLD, serializeLD } from "@/lib/json-ld";
import ImoHillsFarmClient from "./client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  await params;
  const project = projects.find((p) => p.slug === "imo-hills-farm")!;

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: `${project.name} | NEGO Construction`,
      description: project.description,
      images: [
        {
          url: "/imo-hills-1.jpeg",
          width: 1200,
          height: 630,
          alt: `${project.name} — Ilesha, Osun State`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | NEGO Construction`,
      description: project.description,
      images: ["/imo-hills-1.jpeg"],
    },
  };
}

export default async function ImoHillsFarmPage({ params }: Props) {
  await params;
  const project = projects.find((p) => p.slug === "imo-hills-farm")!;
  const projectLD = serializeLD(buildProjectLD(project));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectLD }}
      />
      <ImoHillsFarmClient />
    </>
  );
}
