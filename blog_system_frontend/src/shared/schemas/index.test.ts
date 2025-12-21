import { describe, it, expect } from 'vitest';
import {
  userRequestSchema,
  loginSchema,
  userUpdateSchema,
  postCreateSchema,
  postUpdateSchema,
  commentCreateSchema,
  commentUpdateSchema,
  searchSchema,
} from './index';

describe('Zod Schemas', () => {
  describe('userRequestSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        email: 'test@example.com',
        login: 'testuser',
        password: 'password123',
      };
      const result = userRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять некорректный email', () => {
      const invalidData = {
        email: 'invalid-email',
        login: 'testuser',
        password: 'password123',
      };
      const result = userRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять короткий login', () => {
      const invalidData = {
        email: 'test@example.com',
        login: 'ab',
        password: 'password123',
      };
      const result = userRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять короткий пароль', () => {
      const invalidData = {
        email: 'test@example.com',
        login: 'testuser',
        password: '12345',
      };
      const result = userRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять слишком длинный login', () => {
      const invalidData = {
        email: 'test@example.com',
        login: 'a'.repeat(51),
        password: 'password123',
      };
      const result = userRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        username: 'testuser',
        password: 'password123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять пустой username', () => {
      const invalidData = {
        username: '',
        password: 'password123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять пустой password', () => {
      const invalidData = {
        username: 'testuser',
        password: '',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('userUpdateSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        email: 'updated@example.com',
        login: 'updateduser',
      };
      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять некорректный email', () => {
      const invalidData = {
        email: 'invalid',
        login: 'updateduser',
      };
      const result = userUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('postCreateSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        title: 'Заголовок поста',
        content: 'Содержимое поста для теста',
      };
      const result = postCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен валидировать с categoryIds', () => {
      const validData = {
        title: 'Заголовок поста',
        content: 'Содержимое поста для теста',
        categoryIds: [1, 2, 3],
      };
      const result = postCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять короткий title', () => {
      const invalidData = {
        title: 'Ко',
        content: 'Содержимое поста для теста',
      };
      const result = postCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять короткий content', () => {
      const invalidData = {
        title: 'Заголовок поста',
        content: 'Короткий',
      };
      const result = postCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять слишком длинный title', () => {
      const invalidData = {
        title: 'a'.repeat(201),
        content: 'Содержимое поста для теста',
      };
      const result = postCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('postUpdateSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        title: 'Обновленный заголовок',
        content: 'Обновленное содержимое',
      };
      const result = postUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('commentCreateSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        content: 'Это комментарий',
      };
      const result = commentCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять пустой комментарий', () => {
      const invalidData = {
        content: '',
      };
      const result = commentCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять слишком длинный комментарий', () => {
      const invalidData = {
        content: 'a'.repeat(1001),
      };
      const result = commentCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('commentUpdateSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        content: 'Обновленный комментарий',
      };
      const result = commentUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('searchSchema', () => {
    it('должен валидировать с q параметром', () => {
      const validData = {
        q: 'поисковый запрос',
      };
      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен валидировать без q параметра', () => {
      const validData = {};
      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен валидировать с undefined q', () => {
      const validData = {
        q: undefined,
      };
      const result = searchSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
