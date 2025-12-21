import { describe, it, expect, vi, beforeEach } from 'vitest';
import { categoriesApi } from './categories';
import * as clientModule from './client';

vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../config/env', () => ({
  MOCK_API: false,
}));

vi.mock('../../mocks/services', () => ({
  mockCategoriesService: {
    getCategories: vi.fn(),
    getCategory: vi.fn(),
  },
}));

const mockPagination = {
  total_items: 3,
  total_pages: 1,
  current_page: 1,
  per_page: 100,
  has_next_page: false,
  has_prev_page: false,
  next_page: null,
  prev_page: null,
};

const mockCategories = [
  { id: 1, title: 'JavaScript', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 2, title: 'React', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

describe('categoriesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategories', () => {
    it('должен вызывать GET без параметров', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, categories: mockCategories },
      });

      const result = await categoriesApi.getCategories();

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/categories', { params: undefined });
      expect(result.categories).toEqual(mockCategories);
    });

    it('должен передавать параметры поиска', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, categories: [] },
      });

      const params = { q: 'JavaScript', offset: 0, limit: 10 };
      await categoriesApi.getCategories(params);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/categories', { params });
    });
  });

  describe('getCategory', () => {
    it('должен вызывать GET с правильным ID', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({ data: mockCategories[0] });

      const result = await categoriesApi.getCategory(1);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/categories/1');
      expect(result).toEqual(mockCategories[0]);
    });
  });

  describe('createCategory', () => {
    it('должен вызывать POST с данными', async () => {
      const newCategory = { id: 3, title: 'Vue', createdAt: '2024-01-02T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z' };
      vi.mocked(clientModule.apiClient.post).mockResolvedValue({ data: newCategory });

      const result = await categoriesApi.createCategory({ title: 'Vue' });

      expect(clientModule.apiClient.post).toHaveBeenCalledWith('/api/categories', { title: 'Vue' });
      expect(result).toEqual(newCategory);
    });
  });

  describe('updateCategory', () => {
    it('должен вызывать PUT с ID и данными', async () => {
      const updatedCategory = { ...mockCategories[0], title: 'JavaScript ES2024' };
      vi.mocked(clientModule.apiClient.put).mockResolvedValue({ data: updatedCategory });

      const result = await categoriesApi.updateCategory(1, { title: 'JavaScript ES2024' });

      expect(clientModule.apiClient.put).toHaveBeenCalledWith('/api/categories/1', { title: 'JavaScript ES2024' });
      expect(result.title).toBe('JavaScript ES2024');
    });
  });

  describe('deleteCategory', () => {
    it('должен вызывать DELETE с правильным ID', async () => {
      vi.mocked(clientModule.apiClient.delete).mockResolvedValue({});

      await categoriesApi.deleteCategory(1);

      expect(clientModule.apiClient.delete).toHaveBeenCalledWith('/api/categories/1');
    });
  });
});
