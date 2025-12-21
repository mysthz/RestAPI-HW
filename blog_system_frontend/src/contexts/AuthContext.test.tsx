import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as usersApiModule from '@/shared/api/users';
import * as mockServicesModule from '@/mocks/services';

vi.mock('@/shared/api/users', () => ({
  usersApi: {
    getUsersMe: vi.fn(),
  },
}));

vi.mock('@/mocks/services', () => ({
  setMockCurrentUser: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

const mockUser = {
  id: 1,
  login: 'testuser',
  email: 'test@example.com',
  role: 'user' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const waitForLoadingComplete = async (result: { current: { isLoading: boolean } }) => {
  await vi.waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(localStorage.setItem).mockImplementation(() => {});
    vi.mocked(localStorage.removeItem).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('AuthProvider', () => {
    it('должен инициализироваться с null пользователем когда нет токена', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('должен загружать пользователя когда есть токен', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('valid_token');
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('должен очищать токен при ошибке загрузки пользователя', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid_token');
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockRejectedValue(new Error('Unauthorized'));
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
    });
  });

  describe('login', () => {
    it('должен сохранять токен и загружать пользователя', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('new_token');
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      await act(async () => {
        await result.current.login('new_token');
      });
      
      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'new_token');
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('должен вызывать setMockCurrentUser при MOCK_API', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      await act(async () => {
        await result.current.login('new_token');
      });
      
      expect(mockServicesModule.setMockCurrentUser).toHaveBeenCalledWith(1);
    });
  });

  describe('logout', () => {
    it('должен удалять токен и очищать пользователя', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('valid_token');
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      expect(result.current.user).toEqual(mockUser);
      
      act(() => {
        result.current.logout();
      });
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('должен вызывать setMockCurrentUser(null) при MOCK_API', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('valid_token');
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      act(() => {
        result.current.logout();
      });
      
      expect(mockServicesModule.setMockCurrentUser).toHaveBeenCalledWith(null);
    });
  });

  describe('refreshUser', () => {
    it('должен перезагружать данные пользователя', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('valid_token');
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      const updatedUser = { ...mockUser, login: 'updateduser', updatedAt: '2024-01-02T00:00:00Z' };
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(updatedUser);
      
      await act(async () => {
        await result.current.refreshUser();
      });
      
      expect(result.current.user).toEqual(updatedUser);
    });
  });

  describe('isLoading', () => {
    it('должен быть true во время загрузки', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('valid_token');
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
      );
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      expect(result.current.isLoading).toBe(true);
      
      await waitForLoadingComplete(result);
    });

    it('должен быть false после завершения загрузки', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
    });
  });

  describe('isAuthenticated', () => {
    it('должен быть true когда пользователь авторизован', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('valid_token');
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('должен быть false когда пользователь не авторизован', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('useAuth', () => {
    it('должен выбрасывать ошибку при использовании вне AuthProvider', () => {
      const WrapperWithoutAuth = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
      );
      
      expect(() => {
        renderHook(() => useAuth(), { wrapper: WrapperWithoutAuth });
      }).toThrow('useAuth must be used within an AuthProvider');
    });

    it('должен возвращать все необходимые свойства и методы', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      
      const { result } = renderHook(() => useAuth(), { wrapper });
      
      await waitForLoadingComplete(result);
      
      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('refreshUser');
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.refreshUser).toBe('function');
    });
  });
});
