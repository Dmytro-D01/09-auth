import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api/notes";
import {
  NOTEHUB_OG_IMAGE,
  getOpenGraphUrl,
} from "@/lib/metadata";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

function createNoteDescription(
  title: string,
  content: string,
) {
  const text = content.trim();

  if (!text) {
    return `Details for the "${title}" note in NoteHub.`;
  }

  return text.length > 160
    ? `${text.slice(0, 157)}...`
    : text;
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} | NoteHub`;
    const description =
      createNoteDescription(
        note.title,
        note.content,
      );
    const url = getOpenGraphUrl(
      `/notes/${id}`,
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
  } catch {
    const title = "Note not found | NoteHub";
    const description =
      "The requested NoteHub note could not be found.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: getOpenGraphUrl(
          `/notes/${id}`,
        ),
        images: [NOTEHUB_OG_IMAGE],
      },
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
    >
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
