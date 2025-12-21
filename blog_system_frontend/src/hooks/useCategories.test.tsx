import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useCategories, useCategory } from './useCategories';
import * as categoriesApiModule from '../shared/api/categories';

vi.mock('../shared/api/categories', () => ({
  categoriesApi: {
    getCategories: vi.fn(),
    getCategory: vi.fn(),
  },
}));

const mockCategoriesResponse = {
  pagination: {
    total_items: 3,
    total_pages: 1,
    current_page: 1,
    per_page: 100,
    has_next_page: false,
    has_prev_page: false,
    next_page: null,
    prev_page: null,
  },
  categories: [
    { id: 1, title: 'JavaScript', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 2, title: 'React', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 3, title: 'TypeScript', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  ],
};

const mockCategory = {
  id: 1,
  title: 'JavaScript',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCategories hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useCategories', () => {
    it('должен загружать список категорий', async () => {
      vi.mocked(categoriesApiModule.categoriesApi.getCategories).mockResolvedValue(mockCategoriesResponse);

      const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategoriesResponse);
      expect(categoriesApiModule.categoriesApi.getCategories).toHaveBeenCalledWith(undefined);
    });

    it('должен передавать параметры поиска', async () => {
      vi.mocked(categoriesApiModule.categoriesApi.getCategories).mockResolvedValue(mockCategoriesResponse);

      const params = { q: 'Java', offset: 0, limit: 10 };
      const { result } = renderHook(() => useCategories(params), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(categoriesApiModule.categoriesApi.getCategories).toHaveBeenCalledWith(params);
    });

    it('должен обрабатывать ошибку загрузки', async () => {
      vi.mocked(categoriesApiModule.categoriesApi.getCategories).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('должен использовать правильный queryKey', async () => {
      vi.mocked(categoriesApiModule.categoriesApi.getCategories).mockResolvedValue(mockCategoriesResponse);

      const params = { q: 'test' };
      renderHook(() => useCategories(params), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(categoriesApiModule.categoriesApi.getCategories).toHaveBeenCalled();
      });
    });
  });

  describe('useCategory', () => {
    it('должен загружать одну категорию по ID', async () => {
      vi.mocked(categoriesApiModule.categoriesApi.getCategory).mockResolvedValue(mockCategory);

      const { result } = renderHook(() => useCategory(1), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategory);
      expect(categoriesApiModule.categoriesApi.getCategory).toHaveBeenCalledWith(1);
    });

    it('не должен выполнять запрос при невалидном ID', async () => {
      const { result } = renderHook(() => useCategory(0), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.fetchStatus).toBe('idle');
      });

      expect(categoriesApiModule.categoriesApi.getCategory).not.toHaveBeenCalled();
    });

    it('должен обрабатывать ошибку при отсутствии категории', async () => {
      vi.mocked(categoriesApiModule.categoriesApi.getCategory).mockRejectedValue(new Error('Category not found'));

      const { result } = renderHook(() => useCategory(999), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });
});
