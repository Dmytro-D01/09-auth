import apiClient from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

export interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

async function getCookieHeader(): Promise<string> {
  const { cookies } =
    await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes(
  params?: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const cookieHeader =
    await getCookieHeader();
  const response =
    await apiClient.get<FetchNotesResponse>(
      "/notes",
      {
        params: {
          ...params,
          perPage: 12,
        },
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
  return response.data;
}

export async function fetchNoteById(
  id: string,
): Promise<Note> {
  const cookieHeader =
    await getCookieHeader();
  const response =
    await apiClient.get<Note>(
      `/notes/${id}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
  return response.data;
}

export async function getMe(): Promise<User> {
  const cookieHeader =
    await getCookieHeader();
  const response =
    await apiClient.get<User>(
      "/users/me",
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
  return response.data;
}

// Якщо cookieHeader передано — використовується в middleware.
// Якщо ні — читає cookies з next/headers (серверні компоненти).
export async function checkSession(
  cookieHeader?: string,
): Promise<User | null> {
  try {
    const cookie =
      cookieHeader ??
      (await getCookieHeader());
    const baseURL =
      process.env.NEXT_PUBLIC_API_URL +
      "/api";
    const response = await fetch(
      `${baseURL}/auth/session`,
      {
        headers: { Cookie: cookie },
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.email ? data : null;
  } catch {
    return null;
  }
}
