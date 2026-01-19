import { nextApi } from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';
import { AxiosResponse } from 'axios';
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

export type CheckSessionResponse = {
  success: boolean;
  user?: User;
};

export const fetchNotes = async ({
  page,
  query,
  tag,
  perPage = 12,
}: noteParams): Promise<noteResponse> => {
  const cookieStore = await cookies();

  const response = await nextApi.get<noteResponse>('/notes', {
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

  const res = await nextApi.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const { data } = await nextApi.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const checkSession = async (): Promise<
  AxiosResponse<CheckSessionResponse>
> => {
  const cookieStore = await cookies();

  return await nextApi.get<CheckSessionResponse>('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
};
