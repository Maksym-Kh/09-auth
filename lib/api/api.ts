import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

export const api = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

export const nextApi = axios.create({
  baseURL,
  withCredentials: true,
});
