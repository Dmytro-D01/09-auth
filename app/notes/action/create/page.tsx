import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import {
  NOTEHUB_OG_IMAGE,
  getOpenGraphUrl,
} from "@/lib/metadata";
import css from "./page.module.css";

const title = "Create note | NoteHub";
const description =
  "Create a new personal note in NoteHub.";
const url = getOpenGraphUrl(
  "/notes/action/create",
);

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    images: [NOTEHUB_OG_IMAGE],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>
          Create note
        </h1>
        <NoteForm />
      </div>
    </main>
  );
}
