import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api/notes";
import {
  NOTEHUB_OG_IMAGE,
  getOpenGraphUrl,
} from "@/lib/metadata";
import NotesClient from "./Notes.client";

interface FilteredNotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: FilteredNotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const selectedTag = slug[0] ?? "all";
  const filterName =
    selectedTag === "all"
      ? "All notes"
      : `${selectedTag} notes`;
  const title = `${filterName} | NoteHub`;
  const description = `Browse ${filterName.toLowerCase()} in NoteHub.`;
  const url = getOpenGraphUrl(
    `/notes/filter/${selectedTag}`,
  );

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [NOTEHUB_OG_IMAGE],
    },
  };
}

export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const { slug } = await params;
  const selectedTag = slug[0];
  const tag = selectedTag !== "all" ? selectedTag : undefined;
  const basePath = `/notes/filter/${selectedTag}`;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag ?? "all"],
    queryFn: () => fetchNotes(1, "", tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} basePath={basePath} />
    </HydrationBoundary>
  );
}
