import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api';
import { MOCK_API } from '../config/env';
import { mockUsersService } from '../../mocks/services';
import type {
  UserResponse,
  UsersPaginationResponse,
  UserUpdateRequest,
  SubscribeResponse,
  SubscribePaginationResponse,
  PostsPaginationResponse,
} from '../types';

export const usersApi = {
  getUsers: async (params?: { q?: string; offset?: number; limit?: number }): Promise<UsersPaginationResponse> => {
    if (MOCK_API) {
      return mockUsersService.getUsers(params?.q, params?.offset, params?.limit);
    }
    const response = await apiClient.get<UsersPaginationResponse>(API_ENDPOINTS.users.list, { params });
    return response.data;
  },

  getUsersMe: async (): Promise<UserResponse> => {
    if (MOCK_API) {
      return mockUsersService.getCurrentUser();
    }
    const response = await apiClient.get<UserResponse>(API_ENDPOINTS.users.me);
    return response.data;
  },

  getUser: async (userId: number): Promise<UserResponse> => {
    if (MOCK_API) {
      return mockUsersService.getUser(userId);
    }
    const response = await apiClient.get<UserResponse>(API_ENDPOINTS.users.byId(userId));
    return response.data;
  },

  updateUser: async (userId: number, data: UserUpdateRequest): Promise<UserResponse> => {
    if (MOCK_API) {
      return mockUsersService.updateUser(userId, data);
    }
    const response = await apiClient.put<UserResponse>(API_ENDPOINTS.users.byId(userId), data);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    if (MOCK_API) {
      return;
    }
    await apiClient.delete(API_ENDPOINTS.users.byId(userId));
  },

  getUserSubscriptions: async (
    userId: number,
    params?: { q?: string; offset?: number; limit?: number }
  ): Promise<SubscribePaginationResponse> => {
    if (MOCK_API) {
      return mockUsersService.getUserSubscriptions(userId, params?.offset, params?.limit);
    }
    const response = await apiClient.get<SubscribePaginationResponse>(
      API_ENDPOINTS.users.subscriptions(userId),
      { params }
    );
    return response.data;
  },

  getUserFollowers: async (
    userId: number,
    params?: { q?: string; offset?: number; limit?: number }
  ): Promise<SubscribePaginationResponse> => {
    if (MOCK_API) {
      return mockUsersService.getUserFollowers(userId, params?.offset, params?.limit);
    }
    const response = await apiClient.get<SubscribePaginationResponse>(
      API_ENDPOINTS.users.followers(userId),
      { params }
    );
    return response.data;
  },

  getUserPosts: async (
    userId: number,
    params?: { q?: string; offset?: number; limit?: number }
  ): Promise<PostsPaginationResponse> => {
    if (MOCK_API) {
      const allPosts = await mockUsersService.getUsers();
      return { pagination: allPosts.pagination, posts: [] };
    }
    const response = await apiClient.get<PostsPaginationResponse>(API_ENDPOINTS.users.posts(userId), { params });
    return response.data;
  },

  getUserSavedPosts: async (
    userId: number,
    params?: { q?: string; offset?: number; limit?: number }
  ): Promise<PostsPaginationResponse> => {
    if (MOCK_API) {
      const allPosts = await mockUsersService.getUsers();
      return { pagination: allPosts.pagination, posts: [] };
    }
    const response = await apiClient.get<PostsPaginationResponse>(API_ENDPOINTS.users.savedPosts(userId), { params });
    return response.data;
  },

  subscribe: async (authorId: number): Promise<SubscribeResponse> => {
    if (MOCK_API) {
      return mockUsersService.subscribe(authorId);
    }
    const response = await apiClient.post<SubscribeResponse>(API_ENDPOINTS.users.subscribe(authorId));
    return response.data;
  },

  unsubscribe: async (authorId: number): Promise<void> => {
    if (MOCK_API) {
      return mockUsersService.unsubscribe();
    }
    await apiClient.delete(API_ENDPOINTS.users.subscribe(authorId));
  },
};
