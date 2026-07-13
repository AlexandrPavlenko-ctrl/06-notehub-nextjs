// src/lib/api.ts
import axios, { AxiosResponse } from "axios";
import { Note } from "../types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

// 🌟 Конфігурація базового клієнта
const noteApiClient = axios.create({
  baseURL: "https://notehub-public.goit.study/api", // Базовий префікс
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

// --- Інтерфейси ---
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}
// --- Функції запитів (Зверніть увагою на відносні шляхи) ---

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const queryParams: Record<string, string | number> = {
    page: Number(params.page) || 1,
    perPage: Number(params.perPage) || 12,
  };

  if (params.search && params.search.trim() !== "") {
    queryParams.search = params.search.trim();
  }

  // 🌟 КРИТИЧНЕ ВИПРАВЛЕННЯ: вказуємо відносний роут 'notes' (без косої риски на початку),
  // щоб Axios правильно приєднав його до baseURL і вийшло: .../api/notes
  const response: AxiosResponse<FetchNotesResponse> = await noteApiClient.get(
    "notes",
    {
      params: queryParams,
    },
  );

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  // 🌟 Відносний шлях для деталей однієї нотатки
  const response: AxiosResponse<Note> = await noteApiClient.get(`notes/${id}`);
  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  // 🌟 Відносний шлях для створення
  const response: AxiosResponse<Note> = await noteApiClient.post(
    "notes",
    payload,
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  // 🌟 Відносний шлях для видалення
  const response: AxiosResponse<Note> = await noteApiClient.delete(
    `notes/${id}`,
  );
  return response.data;
};
