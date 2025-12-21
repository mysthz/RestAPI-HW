import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { usePostComments, useCreateComment, useUpdateComment, useDeleteComment } from './useComments';
import * as postsApiModule from '../shared/api/posts';

vi.mock('../shared/api/posts', () => ({
  postsApi: {
    getComments: vi.fn(),
    createComment: vi.fn(),
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockComments = [
  {
    id: 1,
    authorId: 1,
    postId: 1,
    content: 'Первый комментарий',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    authorId: 2,
    postId: 1,
    content: 'Второй комментарий',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

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

describe('useComments hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('usePostComments', () => {
    it('должен загружать комментарии поста', async () => {
      vi.mocked(postsApiModule.postsApi.getComments).mockResolvedValue(mockComments);

      const { result } = renderHook(() => usePostComments(1), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockComments);
      expect(postsApiModule.postsApi.getComments).toHaveBeenCalledWith(1);
    });

    it('не должен загружать при невалидном postId', async () => {
      const { result } = renderHook(() => usePostComments(0), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.fetchStatus).toBe('idle');
      });

      expect(postsApiModule.postsApi.getComments).not.toHaveBeenCalled();
    });

    it('должен обрабатывать ошибку', async () => {
      vi.mocked(postsApiModule.postsApi.getComments).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePostComments(1), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useCreateComment', () => {
    it('должен создавать комментарий', async () => {
      const newComment = {
        id: 3,
        authorId: 1,
        postId: 1,
        content: 'Новый комментарий',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
      };
      vi.mocked(postsApiModule.postsApi.createComment).mockResolvedValue(newComment);

      const { result } = renderHook(() => useCreateComment(1), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate({ content: 'Новый комментарий' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsApiModule.postsApi.createComment).toHaveBeenCalledWith(1, { content: 'Новый комментарий' });
    });

    it('должен обрабатывать ошибку создания', async () => {
      vi.mocked(postsApiModule.postsApi.createComment).mockRejectedValue(new Error('Failed to create'));

      const { result } = renderHook(() => useCreateComment(1), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate({ content: 'Тест' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useUpdateComment', () => {
    it('должен обновлять комментарий', async () => {
      const updatedComment = { ...mockComments[0], content: 'Обновленный комментарий' };
      vi.mocked(postsApiModule.postsApi.updateComment).mockResolvedValue(updatedComment);

      const { result } = renderHook(() => useUpdateComment(1), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate({ commentId: 1, data: { content: 'Обновленный комментарий' } });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsApiModule.postsApi.updateComment).toHaveBeenCalledWith(1, 1, { content: 'Обновленный комментарий' });
    });

    it('должен обрабатывать ошибку обновления', async () => {
      vi.mocked(postsApiModule.postsApi.updateComment).mockRejectedValue(new Error('Failed to update'));

      const { result } = renderHook(() => useUpdateComment(1), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate({ commentId: 1, data: { content: 'Тест' } });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useDeleteComment', () => {
    it('должен удалять комментарий', async () => {
      vi.mocked(postsApiModule.postsApi.deleteComment).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteComment(1), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(postsApiModule.postsApi.deleteComment).toHaveBeenCalledWith(1, 1);
    });

    it('должен обрабатывать ошибку удаления', async () => {
      vi.mocked(postsApiModule.postsApi.deleteComment).mockRejectedValue(new Error('Failed to delete'));

      const { result } = renderHook(() => useDeleteComment(1), { wrapper: createWrapper() });

      await act(async () => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });
});
