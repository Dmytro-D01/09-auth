import apiClient from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  params?: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const response =
    await apiClient.get<FetchNotesResponse>(
      "/notes",
      {
        params: {
          ...params,
          perPage: 12,
        },
      },
    );
  return response.data;
}

export async function fetchNoteById(
  id: string,
): Promise<Note> {
  const response =
    await apiClient.get<Note>(
      `/notes/${id}`,
    );
  return response.data;
}

export async function createNote(
  data: Pick<
    Note,
    "title" | "content" | "tag"
  >,
): Promise<Note> {
  const response =
    await apiClient.post<Note>(
      "/notes",
      data,
    );
  return response.data;
}

export async function deleteNote(
  id: string,
): Promise<Note> {
  const response =
    await apiClient.delete<Note>(
      `/notes/${id}`,
    );
  return response.data;
}

interface AuthCredentials {
  email: string;
  password: string;
}

export async function register(
  credentials: AuthCredentials,
): Promise<User> {
  const response =
    await apiClient.post<User>(
      "/auth/register",
      credentials,
    );
  return response.data;
}

export async function login(
  credentials: AuthCredentials,
): Promise<User> {
  const response =
    await apiClient.post<User>(
      "/auth/login",
      credentials,
    );
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const response =
    await apiClient.get<User | null>(
      "/auth/session",
    );
  return response.data;
}

export async function getMe(): Promise<User> {
  const response =
    await apiClient.get<User>(
      "/users/me",
    );
  return response.data;
}

export async function updateMe(
  data: Partial<Pick<User, "username">>,
): Promise<User> {
  const response =
    await apiClient.patch<User>(
      "/users/me",
      data,
    );
  return response.data;
}
