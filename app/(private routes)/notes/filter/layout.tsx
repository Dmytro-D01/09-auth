import { ReactNode } from "react";
import css from "./layout.module.css";

interface NotesFilterLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function NotesFilterLayout({
  children,
  sidebar,
}: NotesFilterLayoutProps) {
  return (
    <div className={css.layout}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <section className={css.content}>{children}</section>
    </div>
  );
}
