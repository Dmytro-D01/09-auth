"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./noteDetails.module.css";

export default function NoteDetailsClient() {
  const { id } = useParams<{
    id: string;
  }>();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (isLoading)
    return (
      <p>Loading, please wait...</p>
    );
  if (error || !note)
    return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>
          {note.tag}
        </p>
        <p className={css.content}>
          {note.content}
        </p>
        <p className={css.date}>
          {new Date(
            note.createdAt,
          ).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          )}
        </p>
      </div>
    </div>
  );
}
