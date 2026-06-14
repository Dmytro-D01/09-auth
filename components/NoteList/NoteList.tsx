"use client";

import Link from "next/link";
import {
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { Note } from "@/types/note";
import { deleteNote } from "@/lib/api/clientApi";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({
  notes,
}: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li
          key={note._id}
          className={css.item}
        >
          <div className={css.header}>
            <h3
              className={css.noteTitle}
            >
              {note.title}
            </h3>
            <span className={css.tag}>
              {note.tag}
            </span>
          </div>
          <p className={css.content}>
            {note.content}
          </p>
          <div className={css.actions}>
            <Link
              href={`/notes/${note._id}`}
              className={css.viewLink}
            >
              View details
            </Link>
            <button
              className={
                css.deleteButton
              }
              onClick={() =>
                deleteMutation.mutate(
                  note._id,
                )
              }
              disabled={
                deleteMutation.isPending
              }
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
