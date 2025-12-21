import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api';
import { MOCK_API } from '../config/env';
import { mockCategoriesService } from '../../mocks/services';
import type {
  CategoryResponse,
  CategoryPaginationResponse,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from '../types';

export const categoriesApi = {
  getCategories: async (params?: {
    q?: string;
    offset?: number;
    limit?: number;
  }): Promise<CategoryPaginationResponse> => {
    if (MOCK_API) {
      return mockCategoriesService.getCategories(params?.q, params?.offset, params?.limit);
    }
    const response = await apiClient.get<CategoryPaginationResponse>(API_ENDPOINTS.categories.list, { params });
    return response.data;
  },

  getCategory: async (categoryId: number): Promise<CategoryResponse> => {
    if (MOCK_API) {
      return mockCategoriesService.getCategory(categoryId);
    }
    const response = await apiClient.get<CategoryResponse>(API_ENDPOINTS.categories.byId(categoryId));
    return response.data;
  },

  createCategory: async (data: CategoryCreateRequest): Promise<CategoryResponse> => {
    if (MOCK_API) {
      return {
        id: Date.now(),
        title: data.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const response = await apiClient.post<CategoryResponse>(API_ENDPOINTS.categories.list, data);
    return response.data;
  },

  updateCategory: async (categoryId: number, data: CategoryUpdateRequest): Promise<CategoryResponse> => {
    if (MOCK_API) {
      const category = await mockCategoriesService.getCategory(categoryId);
      return { ...category, title: data.title, updatedAt: new Date().toISOString() };
    }
    const response = await apiClient.put<CategoryResponse>(API_ENDPOINTS.categories.byId(categoryId), data);
    return response.data;
  },

  deleteCategory: async (categoryId: number): Promise<void> => {
    if (MOCK_API) {
      return;
    }
    await apiClient.delete(API_ENDPOINTS.categories.byId(categoryId));
  },
};
