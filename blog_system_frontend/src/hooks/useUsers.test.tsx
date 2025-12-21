import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
  useUsers,
  useUser,
  useUpdateUser,
  useSubscribe,
  useUnsubscribe,
  useUserSubscriptions,
  useUserFollowers,
  useUserPosts,
  useUserSavedPosts,
} from './useUsers';
import * as usersApiModule from '../shared/api/users';

vi.mock('../shared/api/users', () => ({
  usersApi: {
    getUsers: vi.fn(),
    getUser: vi.fn(),
    updateUser: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    getUserSubscriptions: vi.fn(),
    getUserFollowers: vi.fn(),
    getUserPosts: vi.fn(),
    getUserSavedPosts: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockUsersResponse = {
  pagination: {
    total_items: 2,
    total_pages: 1,
    current_page: 1,
    per_page: 100,
    has_next_page: false,
    has_prev_page: false,
    next_page: null,
    prev_page: null,
  },
  users: [
    {
      id: 1,
      login: 'user1',
      email: 'user1@example.com',
      role: 'user' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      login: 'user2',
      email: 'user2@example.com',
      role: 'admin' as const,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
  ],
};

const mockUser = mockUsersResponse.users[0];

const mockSubscriptionsResponse = {
  pagination: {
    total_items: 1,
    total_pages: 1,
    current_page: 1,
    per_page: 100,
    has_next_page: false,
    has_prev_page: false,
    next_page: null,
    prev_page: null,
  },
  subscribes: [
    {
      id: 1,
      authorId: 2,
      subscriberId: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ],
};

const mockPostsResponse = {
  pagination: {
    total_items: 1,
    total_pages: 1,
    current_page: 1,
    per_page: 100,
    has_next_page: false,
    has_prev_page: false,
    next_page: null,
    prev_page: null,
  },
  posts: [
    {
      id: 1,
      authorId: 1,
      title: 'Test Post',
      content: 'Test content',
      categories: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ],
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUsers hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useUsers', () => {
    it('должен загружать список пользователей', async () => {
      vi.mocked(usersApiModule.usersApi.getUsers).mockResolvedValue(mockUsersResponse);

      const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUsersResponse);
      expect(usersApiModule.usersApi.getUsers).toHaveBeenCalledWith(undefined);
    });

    it('должен передавать параметры поиска', async () => {
      vi.mocked(usersApiModule.usersApi.getUsers).mockResolvedValue(mockUsersResponse);

      const params = { q: 'user', offset: 0, limit: 10 };
      const { result } = renderHook(() => useUsers(params), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(usersApiModule.usersApi.getUsers).toHaveBeenCalledWith(params);
    });

    it('должен обрабатывать ошибку', async () => {
      vi.mocked(usersApiModule.usersApi.getUsers).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useUser', () => {
    it('должен загружать одного пользователя', async () => {
      vi.mocked(usersApiModule.usersApi.getUser).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useUser(1), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUser);
      expect(usersApiModule.usersApi.getUser).toHaveBeenCalledWith(1);
    });

    it('не должен загружать при невалидном ID', async () => {
      const { result } = renderHook(() => useUser(0), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.fetchStatus).toBe('idle');
      });

      expect(usersApiModule.usersApi.getUser).not.toHaveBeenCalled();
    });
  });

  describe('useUpdateUser', () => {
    it('должен обновлять пользователя', async () => {
      const updatedUser = { ...mockUser, login: 'updated_user' };
      vi.mocked(usersApiModule.usersApi.updateUser).mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUpdateUser(1), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate({ email: 'updated@example.com', login: 'updated_user' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(usersApiModule.usersApi.updateUser).toHaveBeenCalledWith(1, {
        email: 'updated@example.com',
        login: 'updated_user',
      });
    });
  });

  describe('useSubscribe', () => {
    it('должен подписываться на автора', async () => {
      vi.mocked(usersApiModule.usersApi.subscribe).mockResolvedValue({
        id: 1,
        authorId: 2,
        subscriberId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });

      const { result } = renderHook(() => useSubscribe(), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate(2);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(usersApiModule.usersApi.subscribe).toHaveBeenCalledWith(2);
    });
  });

  describe('useUnsubscribe', () => {
    it('должен отписываться от автора', async () => {
      vi.mocked(usersApiModule.usersApi.unsubscribe).mockResolvedValue(undefined);

      const { result } = renderHook(() => useUnsubscribe(), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate(2);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(usersApiModule.usersApi.unsubscribe).toHaveBeenCalledWith(2);
    });
  });

  describe('useUserSubscriptions', () => {
    it('должен загружать подписки пользователя', async () => {
      vi.mocked(usersApiModule.usersApi.getUserSubscriptions).mockResolvedValue(mockSubscriptionsResponse);

      const { result } = renderHook(() => useUserSubscriptions(1), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubscriptionsResponse);
      expect(usersApiModule.usersApi.getUserSubscriptions).toHaveBeenCalledWith(1, undefined);
    });

    it('не должен загружать при отсутствии userId', async () => {
      const { result } = renderHook(() => useUserSubscriptions(undefined), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.fetchStatus).toBe('idle');
      });

      expect(usersApiModule.usersApi.getUserSubscriptions).not.toHaveBeenCalled();
    });
  });

  describe('useUserFollowers', () => {
    it('должен загружать подписчиков пользователя', async () => {
      vi.mocked(usersApiModule.usersApi.getUserFollowers).mockResolvedValue(mockSubscriptionsResponse);

      const { result } = renderHook(() => useUserFollowers(1), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubscriptionsResponse);
      expect(usersApiModule.usersApi.getUserFollowers).toHaveBeenCalledWith(1, undefined);
    });

    it('не должен загружать при отсутствии userId', async () => {
      const { result } = renderHook(() => useUserFollowers(undefined), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.fetchStatus).toBe('idle');
      });
    });
  });

  describe('useUserPosts', () => {
    it('должен загружать посты пользователя', async () => {
      vi.mocked(usersApiModule.usersApi.getUserPosts).mockResolvedValue(mockPostsResponse);

      const { result } = renderHook(() => useUserPosts(1), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPostsResponse);
      expect(usersApiModule.usersApi.getUserPosts).toHaveBeenCalledWith(1, undefined);
    });

    it('не должен загружать при отсутствии userId', async () => {
      const { result } = renderHook(() => useUserPosts(undefined), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.fetchStatus).toBe('idle');
      });
    });
  });

  describe('useUserSavedPosts', () => {
    it('должен загружать сохраненные посты пользователя', async () => {
      vi.mocked(usersApiModule.usersApi.getUserSavedPosts).mockResolvedValue(mockPostsResponse);

      const { result } = renderHook(() => useUserSavedPosts(1), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPostsResponse);
      expect(usersApiModule.usersApi.getUserSavedPosts).toHaveBeenCalledWith(1, undefined);
    });

    it('не должен загружать при отсутствии userId', async () => {
      const { result } = renderHook(() => useUserSavedPosts(undefined), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.fetchStatus).toBe('idle');
      });
    });
  });
});
