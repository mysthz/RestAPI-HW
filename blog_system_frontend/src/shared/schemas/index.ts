import { z } from 'zod';

export const userRequestSchema = z.object({
  email: z.string().email('Некорректный email'),
  login: z.string().min(3, 'Минимум 3 символа').max(50, 'Максимум 50 символов'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Введите логин или email'),
  password: z.string().min(1, 'Введите пароль'),
});

export const userUpdateSchema = z.object({
  email: z.string().email('Некорректный email'),
  login: z.string().min(3, 'Минимум 3 символа').max(50, 'Максимум 50 символов'),
});

export const postCreateSchema = z.object({
  title: z.string().min(5, 'Минимум 5 символов').max(200, 'Максимум 200 символов'),
  content: z.string().min(10, 'Минимум 10 символов'),
  categoryIds: z.array(z.number()).optional(),
});

export const postUpdateSchema = z.object({
  title: z.string().min(5, 'Минимум 5 символов').max(200, 'Максимум 200 символов'),
  content: z.string().min(10, 'Минимум 10 символов'),
  categoryIds: z.array(z.number()).optional(),
});

export const commentCreateSchema = z.object({
  content: z.string().min(1, 'Комментарий не может быть пустым').max(1000, 'Максимум 1000 символов'),
});

export const commentUpdateSchema = z.object({
  content: z.string().min(1, 'Комментарий не может быть пустым').max(1000, 'Максимум 1000 символов'),
});

export const searchSchema = z.object({
  q: z.string().optional(),
});

export type UserRequestForm = z.infer<typeof userRequestSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type UserUpdateForm = z.infer<typeof userUpdateSchema>;
export type PostCreateForm = z.infer<typeof postCreateSchema>;
export type PostUpdateForm = z.infer<typeof postUpdateSchema>;
export type CommentCreateForm = z.infer<typeof commentCreateSchema>;
export type CommentUpdateForm = z.infer<typeof commentUpdateSchema>;
export type SearchForm = z.infer<typeof searchSchema>;
