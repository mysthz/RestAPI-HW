import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usersApi } from './users';
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
  mockUsersService: {
    getUsers: vi.fn(),
    getUser: vi.fn(),
    getCurrentUser: vi.fn(),
    updateUser: vi.fn(),
    getUserSubscriptions: vi.fn(),
    getUserFollowers: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  },
}));

const mockPagination = {
  total_items: 2,
  total_pages: 1,
  current_page: 1,
  per_page: 100,
  has_next_page: false,
  has_prev_page: false,
  next_page: null,
  prev_page: null,
};

const mockUsers = [
  {
    id: 1,
    login: 'user1',
    email: 'user1@example.com',
    role: 'user' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('usersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('должен вызывать GET без параметров', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, users: mockUsers },
      });

      const result = await usersApi.getUsers();

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/users', { params: undefined });
      expect(result.users).toEqual(mockUsers);
    });

    it('должен передавать параметры поиска', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, users: [] },
      });

      const params = { q: 'user', offset: 0, limit: 10 };
      await usersApi.getUsers(params);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/users', { params });
    });
  });

  describe('getUsersMe', () => {
    it('должен вызывать GET для текущего пользователя', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({ data: mockUsers[0] });

      const result = await usersApi.getUsersMe();

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/users/me');
      expect(result).toEqual(mockUsers[0]);
    });
  });

  describe('getUser', () => {
    it('должен вызывать GET с правильным ID', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({ data: mockUsers[0] });

      const result = await usersApi.getUser(1);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/users/1');
      expect(result).toEqual(mockUsers[0]);
    });
  });

  describe('updateUser', () => {
    it('должен вызывать PUT с ID и данными', async () => {
      const updatedUser = { ...mockUsers[0], login: 'updated_user' };
      vi.mocked(clientModule.apiClient.put).mockResolvedValue({ data: updatedUser });

      const result = await usersApi.updateUser(1, { email: 'new@example.com', login: 'updated_user' });

      expect(clientModule.apiClient.put).toHaveBeenCalledWith('/api/users/1', { email: 'new@example.com', login: 'updated_user' });
      expect(result.login).toBe('updated_user');
    });
  });

  describe('deleteUser', () => {
    it('должен вызывать DELETE с правильным ID', async () => {
      vi.mocked(clientModule.apiClient.delete).mockResolvedValue({});

      await usersApi.deleteUser(1);

      expect(clientModule.apiClient.delete).toHaveBeenCalledWith('/api/users/1');
    });
  });

  describe('getUserSubscriptions', () => {
    it('должен вызывать GET для подписок пользователя', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, subscribes: [] },
      });

      const result = await usersApi.getUserSubscriptions(1);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/users/1/subscriptions', { params: undefined });
      expect(result.subscribes).toEqual([]);
    });

    it('должен передавать параметры', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, subscribes: [] },
      });

      const params = { q: 'test', offset: 0, limit: 10 };
      await usersApi.getUserSubscriptions(1, params);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/users/1/subscriptions', { params });
    });
  });

  describe('getUserFollowers', () => {
    it('должен вызывать GET для подписчиков пользователя', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, subscribes: [] },
      });

      const result = await usersApi.getUserFollowers(1);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/users/1/followers', { params: undefined });
      expect(result.subscribes).toEqual([]);
    });
  });

  describe('getUserPosts', () => {
    it('должен вызывать GET для постов пользователя', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, posts: [] },
      });

      const result = await usersApi.getUserPosts(1);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/users/1/posts', { params: undefined });
      expect(result.posts).toEqual([]);
    });
  });

  describe('getUserSavedPosts', () => {
    it('должен вызывать GET для сохраненных постов', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, posts: [] },
      });

      const result = await usersApi.getUserSavedPosts(1);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/users/1/saved-posts', { params: undefined });
      expect(result.posts).toEqual([]);
    });

    it('должен передавать параметры поиска', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, posts: [] },
      });

      await usersApi.getUserSavedPosts(1, { q: 'test' });

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/users/1/saved-posts', { params: { q: 'test' } });
    });
  });

  describe('subscribe', () => {
    it('должен вызывать POST для подписки', async () => {
      const subscribeResponse = { id: 1, authorId: 2, subscriberId: 1, createdAt: '', updatedAt: '' };
      vi.mocked(clientModule.apiClient.post).mockResolvedValue({ data: subscribeResponse });

      const result = await usersApi.subscribe(2);

      expect(clientModule.apiClient.post).toHaveBeenCalledWith('/api/users/2/subscribe');
      expect(result).toEqual(subscribeResponse);
    });
  });

  describe('unsubscribe', () => {
    it('должен вызывать DELETE для отписки', async () => {
      vi.mocked(clientModule.apiClient.delete).mockResolvedValue({});

      await usersApi.unsubscribe(2);

      expect(clientModule.apiClient.delete).toHaveBeenCalledWith('/api/users/2/subscribe');
    });
  });
});
