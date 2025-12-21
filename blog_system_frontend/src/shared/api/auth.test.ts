import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from './auth';
import * as clientModule from './client';

vi.mock('./client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock('../config/env', () => ({
  MOCK_API: false,
}));

vi.mock('../../mocks/services', () => ({
  mockAuthService: {
    register: vi.fn(),
    login: vi.fn(),
  },
}));

const mockTokenResponse = {
  access_token: 'test_token_123',
  token_type: 'bearer',
  expires_at: '2025-01-01T00:00:00Z',
};

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('должен вызывать POST с правильными данными', async () => {
      vi.mocked(clientModule.apiClient.post).mockResolvedValue({ data: mockTokenResponse });

      const userData = {
        email: 'test@example.com',
        login: 'testuser',
        password: 'password123',
      };

      const result = await authApi.register(userData);

      expect(clientModule.apiClient.post).toHaveBeenCalledWith('/api/auth/register', userData);
      expect(result).toEqual(mockTokenResponse);
    });

    it('должен возвращать данные токена', async () => {
      vi.mocked(clientModule.apiClient.post).mockResolvedValue({ data: mockTokenResponse });

      const result = await authApi.register({
        email: 'new@example.com',
        login: 'newuser',
        password: 'newpassword',
      });

      expect(result.access_token).toBe('test_token_123');
      expect(result.token_type).toBe('bearer');
    });

    it('должен пробрасывать ошибку при неудачной регистрации', async () => {
      vi.mocked(clientModule.apiClient.post).mockRejectedValue(new Error('Email already exists'));

      await expect(
        authApi.register({
          email: 'existing@example.com',
          login: 'existinguser',
          password: 'password',
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('должен вызывать POST с URLSearchParams', async () => {
      vi.mocked(clientModule.apiClient.post).mockResolvedValue({ data: mockTokenResponse });

      const loginData = {
        username: 'testuser',
        password: 'password123',
      };

      const result = await authApi.login(loginData);

      expect(clientModule.apiClient.post).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.any(URLSearchParams),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );
      expect(result).toEqual(mockTokenResponse);
    });

    it('должен корректно формировать URLSearchParams', async () => {
      vi.mocked(clientModule.apiClient.post).mockResolvedValue({ data: mockTokenResponse });

      await authApi.login({ username: 'user1', password: 'pass1' });

      const callArgs = vi.mocked(clientModule.apiClient.post).mock.calls[0];
      const formData = callArgs[1] as URLSearchParams;

      expect(formData.get('username')).toBe('user1');
      expect(formData.get('password')).toBe('pass1');
    });

    it('должен пробрасывать ошибку при неверных данных', async () => {
      vi.mocked(clientModule.apiClient.post).mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        authApi.login({ username: 'wrong', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
