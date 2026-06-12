"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
} from "zustand/middleware";
import { CreateNoteData } from "@/types/note";

export const initialDraft: CreateNoteData = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteStore {
  draft: CreateNoteData;
  setDraft: (
    note: Partial<CreateNoteData>,
  ) => void;
  clearDraft: () => void;
}

export const useNoteStore =
  create<NoteStore>()(
    persist(
      (set) => ({
        draft: initialDraft,
        setDraft: (note) =>
          set((state) => ({
            draft: {
              ...state.draft,
              ...note,
            },
          })),
        clearDraft: () =>
          set({ draft: initialDraft }),
      }),
      {
        name: "notehub-note-draft",
        storage: createJSONStorage(
          () => localStorage,
        ),
      },
    ),
  );
