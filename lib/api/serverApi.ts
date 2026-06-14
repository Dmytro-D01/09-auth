import axios from "axios";
import { Note } from "@/types/note";
import { User } from "@/types/user";

const serverAxios = axios.create({
  baseURL:
    "https://notehub-api.goit.study",
  withCredentials: true,
});

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
    await serverAxios.get<FetchNotesResponse>(
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
    await serverAxios.get<Note>(
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
    await serverAxios.get<User>(
      "/users/me",
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
  return response.data;
}

export async function checkSession(
  cookieHeader?: string,
): Promise<User | null> {
  try {
    const cookie =
      cookieHeader ??
      (await getCookieHeader());
    const response =
      await serverAxios.get(
        "/auth/session",
        {
          headers: { Cookie: cookie },
        },
      );
    return response.data?.email
      ? response.data
      : null;
  } catch {
    return null;
  }
}
