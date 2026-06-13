"use client";

import {
  type ChangeEvent,
  useState,
} from "react";
import {
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api/clientApi";
import { CreateNoteData } from "@/types/note";
import {
  initialDraft,
  useNoteStore,
} from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

const TAGS = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

type NoteFormErrors = Partial<
  Record<keyof CreateNoteData, string>
>;

function isNoteTag(
  tag: string,
): tag is (typeof TAGS)[number] {
  return TAGS.includes(
    tag as (typeof TAGS)[number],
  );
}

function readFormValue(
  formData: FormData,
  key: keyof CreateNoteData,
) {
  const value = formData.get(key);
  return typeof value === "string"
    ? value
    : "";
}

function getNoteData(
  formData: FormData,
): CreateNoteData {
  const tag = readFormValue(
    formData,
    "tag",
  );

  return {
    title: readFormValue(
      formData,
      "title",
    ),
    content: readFormValue(
      formData,
      "content",
    ),
    tag: isNoteTag(tag)
      ? tag
      : initialDraft.tag,
  };
}

function validateNote(
  note: CreateNoteData,
) {
  const errors: NoteFormErrors = {};
  const title = note.title.trim();

  if (!title) {
    errors.title = "Title is required";
  } else if (title.length < 3) {
    errors.title =
      "Title must be at least 3 characters";
  } else if (title.length > 50) {
    errors.title =
      "Title must be at most 50 characters";
  }

  if (note.content.length > 500) {
    errors.content =
      "Content must be at most 500 characters";
  }

  if (!isNoteTag(note.tag)) {
    errors.tag = "Invalid tag";
  }

  return errors;
}

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore(
    (state) => state.draft,
  );
  const setDraft = useNoteStore(
    (state) => state.setDraft,
  );
  const clearDraft = useNoteStore(
    (state) => state.clearDraft,
  );
  const [errors, setErrors] =
    useState<NoteFormErrors>({});

  const mutation = useMutation({
    mutationFn: (
      data: CreateNoteData,
    ) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      clearDraft();
      router.back();
    },
  });

  function handleFieldChange(
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) {
    const fieldName = event.target
      .name as keyof CreateNoteData;
    const nextDraft = {
      ...draft,
      [fieldName]: event.target.value,
    };

    setDraft({
      [fieldName]:
        event.target.value,
    } as Partial<CreateNoteData>);

    if (Object.keys(errors).length > 0) {
      setErrors(
        validateNote(nextDraft),
      );
    }

    if (mutation.error) {
      mutation.reset();
    }
  }

  function formAction(
    formData: FormData,
  ) {
    const noteData =
      getNoteData(formData);
    const nextErrors =
      validateNote(noteData);

    setDraft(noteData);
    setErrors(nextErrors);

    if (
      Object.keys(nextErrors)
        .length > 0
    ) {
      return;
    }

    mutation.mutate(noteData);
  }

  return (
    <form
      className={css.form}
      action={formAction}
      noValidate
    >
      <h2 className={css.title}>
        Create New Note
      </h2>

      <label className={css.label}>
        Title
        <input
          className={css.input}
          name="title"
          type="text"
          placeholder="Note title..."
          value={draft.title}
          onChange={handleFieldChange}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <span className={css.error}>
            {errors.title}
          </span>
        )}
      </label>

      <label className={css.label}>
        Content
        <textarea
          className={css.textarea}
          name="content"
          placeholder="Note content..."
          rows={5}
          value={draft.content}
          onChange={handleFieldChange}
          aria-invalid={!!errors.content}
        />
        {errors.content && (
          <span className={css.error}>
            {errors.content}
          </span>
        )}
      </label>

      <label className={css.label}>
        Tag
        <select
          className={css.select}
          name="tag"
          value={
            isNoteTag(draft.tag)
              ? draft.tag
              : initialDraft.tag
          }
          onChange={handleFieldChange}
          aria-invalid={!!errors.tag}
        >
          {TAGS.map((tag) => (
            <option
              key={tag}
              value={tag}
            >
              {tag}
            </option>
          ))}
        </select>
        {errors.tag && (
          <span className={css.error}>
            {errors.tag}
          </span>
        )}
      </label>

      {mutation.error && (
        <span className={css.error}>
          {(mutation.error as Error)
            .message}
        </span>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
          formAction={formAction}
        >
          {mutation.isPending
            ? "Creating..."
            : "Create Note"}
        </button>
      </div>
    </form>
  );
}
