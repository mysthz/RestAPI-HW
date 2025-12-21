import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useLogin, useRegister } from './useAuth';
import { AuthProvider } from '../contexts/AuthContext';
import * as authApiModule from '../shared/api/auth';
import * as usersApiModule from '../shared/api/users';

vi.mock('../shared/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

vi.mock('../shared/api/users', () => ({
  usersApi: {
    getUsersMe: vi.fn(),
  },
}));

vi.mock('../mocks/services', () => ({
  setMockCurrentUser: vi.fn(),
}));

const mockToken = {
  access_token: 'test_token',
  token_type: 'bearer',
  expires_at: '2025-01-01T00:00:00Z',
};

const mockUser = {
  id: 1,
  login: 'testuser',
  email: 'test@example.com',
  role: 'user' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('useAuth hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(localStorage.setItem).mockImplementation(() => {});
    vi.mocked(localStorage.removeItem).mockImplementation(() => {});
  });

  describe('useLogin', () => {
    it('должен возвращать mutation объект', async () => {
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockRejectedValue(new Error('No token'));
      
      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current).toHaveProperty('mutate');
        expect(result.current).toHaveProperty('mutateAsync');
        expect(result.current).toHaveProperty('isPending');
        expect(result.current).toHaveProperty('isError');
        expect(result.current).toHaveProperty('isSuccess');
      });
    });

    it('должен вызывать authApi.login при мутации', async () => {
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockRejectedValue(new Error('No token'));
      vi.mocked(authApiModule.authApi.login).mockResolvedValue(mockToken);
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      result.current.mutate({ username: 'test', password: 'password' });

      await waitFor(() => {
        expect(authApiModule.authApi.login).toHaveBeenCalledWith({
          username: 'test',
          password: 'password',
        });
      });
    });

    it('должен обрабатывать ошибку при неудачном логине', async () => {
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockRejectedValue(new Error('No token'));
      vi.mocked(authApiModule.authApi.login).mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      result.current.mutate({ username: 'test', password: 'wrong' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useRegister', () => {
    it('должен возвращать mutation объект', async () => {
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockRejectedValue(new Error('No token'));
      
      const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current).toHaveProperty('mutate');
        expect(result.current).toHaveProperty('mutateAsync');
        expect(result.current).toHaveProperty('isPending');
      });
    });

    it('должен вызывать authApi.register при мутации', async () => {
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockRejectedValue(new Error('No token'));
      vi.mocked(authApiModule.authApi.register).mockResolvedValue(mockToken);
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      result.current.mutate({
        email: 'test@example.com',
        login: 'testuser',
        password: 'password123',
      });

      await waitFor(() => {
        expect(authApiModule.authApi.register).toHaveBeenCalledWith({
          email: 'test@example.com',
          login: 'testuser',
          password: 'password123',
        });
      });
    });

    it('должен обрабатывать ошибку при неудачной регистрации', async () => {
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockRejectedValue(new Error('No token'));
      vi.mocked(authApiModule.authApi.register).mockRejectedValue(new Error('Email already exists'));

      const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      result.current.mutate({
        email: 'existing@example.com',
        login: 'existinguser',
        password: 'password123',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });
});
