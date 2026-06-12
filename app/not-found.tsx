import type { Metadata } from "next";
import {
  NOTEHUB_OG_IMAGE,
  getOpenGraphUrl,
} from "@/lib/metadata";
import css from "./not-found.module.css";

const title = "Page not found | NoteHub";
const description =
  "The requested NoteHub page does not exist.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: getOpenGraphUrl("/404"),
    images: [NOTEHUB_OG_IMAGE],
  },
};

export default function NotFound() {
  return (
    <div className={css.page}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
