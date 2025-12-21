import axios from 'axios';
import { toast } from 'sonner';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.detail?.[0]?.msg || error.response?.data?.detail || error.message;
    
    if (status === 401) {
      localStorage.removeItem('access_token');
      toast.error(`Ошибка ${status}: Требуется авторизация`);
    } else if (status === 403) {
      toast.error(`Ошибка ${status}: Доступ запрещён`);
    } else if (status === 404) {
      toast.error(`Ошибка ${status}: Не найдено`);
    } else if (status === 422) {
      toast.error(`Ошибка валидации: ${message}`);
    } else if (status >= 500) {
      toast.error(`Ошибка сервера ${status}: ${message}`);
    } else if (status) {
      toast.error(`Ошибка ${status}: ${message}`);
    } else {
      toast.error(`Ошибка сети: ${message}`);
    }
    
    return Promise.reject(error);
  }
);
