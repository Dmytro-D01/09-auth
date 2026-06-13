export interface Note {
  _id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateNoteData = Pick<
  Note,
  "title" | "content" | "tag"
>;