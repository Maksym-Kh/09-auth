import { User } from '@/types/user';
import { nextApi } from './api';
import { Note } from '@/types/note';

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
interface createNoteProps {
  title: string;
  content: string;
  tag: string;
}
interface RegisterRequest {
  email: string;
  password: string;
  // username: string;
}
export type UserData = {
  id: string;
  email: string;
  username: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
};
export type LoginRequest = {
  email: string;
  password: string;
};
export type CheckSessionRequest = {
  success: boolean;
};
export type UpdateUserRequest = {
  username?: string;
};

export const fetchNotes = async ({
  page,
  query,
  tag,
  perPage = 12,
}: noteParams): Promise<noteResponse> => {
  const response = await nextApi.get<noteResponse>('/notes', {
    params: {
      page: page,
      search: query,
      perPage: perPage,
      tag: tag === 'all' ? undefined : tag,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await nextApi.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (noteInfo: createNoteProps): Promise<Note> => {
  const response = await nextApi.post<Note>('/notes', noteInfo);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextApi.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const register = async (userInfo: RegisterRequest): Promise<User> => {
  const { data } = await nextApi.post<User>('/auth/register', userInfo);
  return data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextApi.post<User>('/auth/login', data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextApi.post('/auth/logout');
};

export const checkSession = async (): Promise<boolean> => {
  const res = await nextApi.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextApi.get<User>('/users/me');
  return data;
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const res = await nextApi.patch<User>('/users/me', payload);
  return res.data;
};
