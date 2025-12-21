import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../shared/api/categories';

function useCategories(params?: { q?: string; offset?: number; limit?: number }) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoriesApi.getCategories(params),
  });
}

function useCategory(categoryId: number) {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoriesApi.getCategory(categoryId),
    enabled: !!categoryId,
  });
}

export { useCategories, useCategory };
