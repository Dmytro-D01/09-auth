"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/notes";
import css from "./NotePreview.module.css";

export default function NotePreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

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

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading, please wait...</p>}
      {(error || !note) && !isLoading && <p>Something went wrong.</p>}
      {note && (
        <div className={css.preview}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
            {new Date(note.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}
    </Modal>
  );
}
