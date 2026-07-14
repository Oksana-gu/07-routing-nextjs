import axios from 'axios';
import { Note } from '@/types/note';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  search: string;
  tag?: string;
}

const instance = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export async function fetchNotes({
  page = 1,
  search = "",
  tag,
}: FetchNotesParams):Promise<FetchNotesResponse> {
  const params = new URLSearchParams();

  params.set("page", String(page));

  if (search) {
    params.set("search", search);
  }

  if (tag) {
    params.set("tag", tag);
  }

 const { data } =
  await instance.get<FetchNotesResponse>(
    `/notes?${params.toString()}`
  );

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await instance.get<Note>(`/notes/${id}`);

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await instance.delete<Note>(`/notes/${id}`);

  return response.data;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: string;
}

export async function createNote(
  data: CreateNoteData
): Promise<Note> {
  const response = await instance.post<Note>(
    '/notes',
    data
  );

  return response.data;
}

