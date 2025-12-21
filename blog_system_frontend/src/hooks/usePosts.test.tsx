import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  usePosts,
  usePost,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useSavedPostIds,
  useSavedPosts,
  useSavePost,
  useUnsavePost,
} from './usePosts';
import * as postsApiModule from '../shared/api/posts';

vi.mock('../shared/api/posts', () => ({
  postsApi: {
    getPosts: vi.fn(),
    getPost: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
    getSavedPostIds: vi.fn(),
    getSavedPosts: vi.fn(),
    savePost: vi.fn(),
    unsavePost: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockPostsResponse = {
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
  posts: [
    {
      id: 1,
      authorId: 1,
      title: 'Первый пост',
      content: 'Содержимое первого поста',
      categories: ['JavaScript'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      authorId: 2,
      title: 'Второй пост',
      content: 'Содержимое второго поста',
      categories: ['React'],
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
  ],
};

const mockPost = mockPostsResponse.posts[0];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('usePosts hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('usePosts', () => {
    it('должен загружать список постов', async () => {
      vi.mocked(postsApiModule.postsApi.getPosts).mockResolvedValue(mockPostsResponse);

      const { result } = renderHook(() => usePosts(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPostsResponse);
      expect(postsApiModule.postsApi.getPosts).toHaveBeenCalledWith(undefined);
    });

    it('должен передавать параметры поиска', async () => {
      vi.mocked(postsApiModule.postsApi.getPosts).mockResolvedValue(mockPostsResponse);

      const params = { q: 'React', offset: 0, limit: 10 };
      const { result } = renderHook(() => usePosts(params), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsApiModule.postsApi.getPosts).toHaveBeenCalledWith(params);
    });

    it('должен обрабатывать ошибку', async () => {
      vi.mocked(postsApiModule.postsApi.getPosts).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePosts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('usePost', () => {
    it('должен загружать один пост', async () => {
      vi.mocked(postsApiModule.postsApi.getPost).mockResolvedValue(mockPost);

      const { result } = renderHook(() => usePost(1), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPost);
      expect(postsApiModule.postsApi.getPost).toHaveBeenCalledWith(1);
    });

    it('не должен загружать при невалидном ID', async () => {
      const { result } = renderHook(() => usePost(0), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.fetchStatus).toBe('idle');
      });

      expect(postsApiModule.postsApi.getPost).not.toHaveBeenCalled();
    });
  });

  describe('useCreatePost', () => {
    it('должен создавать пост', async () => {
      vi.mocked(postsApiModule.postsApi.createPost).mockResolvedValue(mockPost);

      const { result } = renderHook(() => useCreatePost(), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate({ title: 'Новый пост', content: 'Содержимое' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsApiModule.postsApi.createPost).toHaveBeenCalledWith({ title: 'Новый пост', content: 'Содержимое' });
    });

    it('должен обрабатывать ошибку создания', async () => {
      vi.mocked(postsApiModule.postsApi.createPost).mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useCreatePost(), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate({ title: 'Тест', content: 'Содержимое' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useUpdatePost', () => {
    it('должен обновлять пост', async () => {
      const updatedPost = { ...mockPost, title: 'Обновленный пост' };
      vi.mocked(postsApiModule.postsApi.updatePost).mockResolvedValue(updatedPost);

      const { result } = renderHook(() => useUpdatePost(1), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate({ title: 'Обновленный пост', content: 'Содержимое' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsApiModule.postsApi.updatePost).toHaveBeenCalledWith(1, { title: 'Обновленный пост', content: 'Содержимое' });
    });
  });

  describe('useDeletePost', () => {
    it('должен удалять пост', async () => {
      vi.mocked(postsApiModule.postsApi.deletePost).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeletePost(), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsApiModule.postsApi.deletePost).toHaveBeenCalledWith(1);
    });
  });

  describe('useSavedPostIds', () => {
    it('должен загружать ID сохраненных постов', async () => {
      vi.mocked(postsApiModule.postsApi.getSavedPostIds).mockResolvedValue([1, 2, 3]);

      const { result } = renderHook(() => useSavedPostIds(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([1, 2, 3]);
    });
  });

  describe('useSavedPosts', () => {
    it('должен загружать сохраненные посты', async () => {
      vi.mocked(postsApiModule.postsApi.getSavedPosts).mockResolvedValue(mockPostsResponse.posts);

      const { result } = renderHook(() => useSavedPosts(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPostsResponse.posts);
    });

    it('должен передавать параметры поиска', async () => {
      vi.mocked(postsApiModule.postsApi.getSavedPosts).mockResolvedValue([]);

      const { result } = renderHook(() => useSavedPosts({ q: 'test' }), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsApiModule.postsApi.getSavedPosts).toHaveBeenCalledWith({ q: 'test' });
    });
  });

  describe('useSavePost', () => {
    it('должен сохранять пост', async () => {
      vi.mocked(postsApiModule.postsApi.savePost).mockResolvedValue({
        id: 1,
        userId: 1,
        postId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });

      const { result } = renderHook(() => useSavePost(), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsApiModule.postsApi.savePost).toHaveBeenCalledWith(1);
    });
  });

  describe('useUnsavePost', () => {
    it('должен удалять пост из сохраненных', async () => {
      vi.mocked(postsApiModule.postsApi.unsavePost).mockResolvedValue(undefined);

      const { result } = renderHook(() => useUnsavePost(), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsApiModule.postsApi.unsavePost).toHaveBeenCalledWith(1);
    });
  });
});
