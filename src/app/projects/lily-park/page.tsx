import type { Metadata, ResolvingMetadata } from "next";
import { projects } from "@/lib/site-data";
import { buildProjectLD, serializeLD } from "@/lib/json-ld";
import LilyParkClient from "./client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  await params; // params resolved but slug is fixed for this page
  const project = projects.find((p) => p.slug === "lily-park")!;

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: `${project.name} | NEGO Construction`,
      description: project.description,
      images: [
        {
          url: "/DJI_0345.jpg",
          width: 1200,
          height: 630,
          alt: `${project.name} — aerial view`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | NEGO Construction`,
      description: project.description,
      images: ["/DJI_0345.jpg"],
    },
  };
}

export default async function LilyParkPage({ params }: Props) {
  await params;
  const project = projects.find((p) => p.slug === "lily-park")!;
  const projectLD = serializeLD(buildProjectLD(project));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectLD }}
      />
      <LilyParkClient />
    </>
  );
}
