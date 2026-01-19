import { api } from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';
import { cookies } from 'next/headers';

interface noteResponse {
  notes: Note[];
  totalPages: number;
}
interface noteParams {
  page?: number;
  query?: string;
  tag?: string;
  perPage?: number;
}

export type CheckSessionRequest = {
  success: boolean;
};

export const fetchNotes = async ({
  page,
  query,
  tag,
  perPage = 12,
}: noteParams): Promise<noteResponse> => {
  const cookieStore = await cookies();

  const response = await api.get<noteResponse>('/notes', {
    params: {
      page: page,
      search: query,
      perPage: perPage,
      tag: tag === 'all' ? undefined : tag,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();

  const res = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const { data } = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const checkSession = async (): Promise<boolean> => {
  const cookieStore = await cookies();

  try {
    const res = await api.get<CheckSessionRequest>('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return res.data.success;
  } catch (error) {
    return false;
  }
};
