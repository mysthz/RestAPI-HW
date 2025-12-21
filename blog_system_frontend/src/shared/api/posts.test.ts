import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postsApi } from './posts';
import * as clientModule from './client';
import * as usersApiModule from './users';

vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('./users', () => ({
  usersApi: {
    getUsersMe: vi.fn(),
    getUserSavedPosts: vi.fn(),
  },
}));

vi.mock('../config/env', () => ({
  MOCK_API: false,
}));

vi.mock('../../mocks/services', () => ({
  mockPostsService: {
    getPosts: vi.fn(),
    getPost: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
    getComments: vi.fn(),
    createComment: vi.fn(),
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
    savePost: vi.fn(),
    unsavePost: vi.fn(),
    getSavedPostIds: vi.fn(),
    getSavedPosts: vi.fn(),
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

const mockPosts = [
  {
    id: 1,
    authorId: 1,
    title: 'Первый пост',
    content: 'Содержимое',
    categories: ['JavaScript'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockComment = {
  id: 1,
  authorId: 1,
  postId: 1,
  content: 'Комментарий',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('postsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPosts', () => {
    it('должен вызывать GET без параметров', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, posts: mockPosts },
      });

      const result = await postsApi.getPosts();

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/posts', { params: undefined });
      expect(result.posts).toEqual(mockPosts);
    });

    it('должен передавать параметры поиска', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({
        data: { pagination: mockPagination, posts: [] },
      });

      const params = { q: 'React', offset: 0, limit: 10 };
      await postsApi.getPosts(params);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/posts', { params });
    });
  });

  describe('getPost', () => {
    it('должен вызывать GET с правильным ID', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({ data: mockPosts[0] });

      const result = await postsApi.getPost(1);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/posts/1');
      expect(result).toEqual(mockPosts[0]);
    });
  });

  describe('createPost', () => {
    it('должен вызывать POST с данными', async () => {
      vi.mocked(clientModule.apiClient.post).mockResolvedValue({ data: mockPosts[0] });

      const result = await postsApi.createPost({ title: 'Новый пост', content: 'Содержимое' });

      expect(clientModule.apiClient.post).toHaveBeenCalledWith('/api/posts', { title: 'Новый пост', content: 'Содержимое' });
      expect(result).toEqual(mockPosts[0]);
    });
  });

  describe('updatePost', () => {
    it('должен вызывать PUT с ID и данными', async () => {
      const updatedPost = { ...mockPosts[0], title: 'Обновленный пост' };
      vi.mocked(clientModule.apiClient.put).mockResolvedValue({ data: updatedPost });

      const result = await postsApi.updatePost(1, { title: 'Обновленный пост', content: 'Содержимое' });

      expect(clientModule.apiClient.put).toHaveBeenCalledWith('/api/posts/1', { title: 'Обновленный пост', content: 'Содержимое' });
      expect(result.title).toBe('Обновленный пост');
    });
  });

  describe('deletePost', () => {
    it('должен вызывать DELETE с правильным ID', async () => {
      vi.mocked(clientModule.apiClient.delete).mockResolvedValue({});

      await postsApi.deletePost(1);

      expect(clientModule.apiClient.delete).toHaveBeenCalledWith('/api/posts/1');
    });
  });

  describe('getComments', () => {
    it('должен вызывать GET для комментариев поста', async () => {
      vi.mocked(clientModule.apiClient.get).mockResolvedValue({ data: [mockComment] });

      const result = await postsApi.getComments(1);

      expect(clientModule.apiClient.get).toHaveBeenCalledWith('/api/posts/1/comments');
      expect(result).toEqual([mockComment]);
    });
  });

  describe('createComment', () => {
    it('должен вызывать POST для создания комментария', async () => {
      vi.mocked(clientModule.apiClient.post).mockResolvedValue({ data: mockComment });

      const result = await postsApi.createComment(1, { content: 'Новый комментарий' });

      expect(clientModule.apiClient.post).toHaveBeenCalledWith('/api/posts/1/comments', { content: 'Новый комментарий' });
      expect(result).toEqual(mockComment);
    });
  });

  describe('updateComment', () => {
    it('должен вызывать PUT для обновления комментария', async () => {
      const updatedComment = { ...mockComment, content: 'Обновленный комментарий' };
      vi.mocked(clientModule.apiClient.put).mockResolvedValue({ data: updatedComment });

      const result = await postsApi.updateComment(1, 1, { content: 'Обновленный комментарий' });

      expect(clientModule.apiClient.put).toHaveBeenCalledWith('/api/posts/1/comments/1', { content: 'Обновленный комментарий' });
      expect(result.content).toBe('Обновленный комментарий');
    });
  });

  describe('deleteComment', () => {
    it('должен вызывать DELETE для удаления комментария', async () => {
      vi.mocked(clientModule.apiClient.delete).mockResolvedValue({});

      await postsApi.deleteComment(1, 1);

      expect(clientModule.apiClient.delete).toHaveBeenCalledWith('/api/posts/1/comments/1');
    });
  });

  describe('savePost', () => {
    it('должен вызывать POST для сохранения поста', async () => {
      const savedPost = { id: 1, userId: 1, postId: 1, createdAt: '', updatedAt: '' };
      vi.mocked(clientModule.apiClient.post).mockResolvedValue({ data: savedPost });

      const result = await postsApi.savePost(1);

      expect(clientModule.apiClient.post).toHaveBeenCalledWith('/api/posts/1/save');
      expect(result).toEqual(savedPost);
    });
  });

  describe('unsavePost', () => {
    it('должен вызывать DELETE для удаления из сохраненных', async () => {
      vi.mocked(clientModule.apiClient.delete).mockResolvedValue({});

      await postsApi.unsavePost(1);

      expect(clientModule.apiClient.delete).toHaveBeenCalledWith('/api/posts/1/save');
    });
  });

  describe('getSavedPostIds', () => {
    it('должен получать ID сохраненных постов', async () => {
      const mockUser = { id: 1, login: 'user', email: 'user@test.com', role: 'user' as const, createdAt: '', updatedAt: '' };
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);
      vi.mocked(usersApiModule.usersApi.getUserSavedPosts).mockResolvedValue({
        pagination: mockPagination,
        posts: mockPosts,
      });

      const result = await postsApi.getSavedPostIds();

      expect(usersApiModule.usersApi.getUsersMe).toHaveBeenCalled();
      expect(result).toEqual([1]);
    });
  });

  describe('getSavedPosts', () => {
    it('должен получать сохраненные посты', async () => {
      const mockUser = { id: 1, login: 'user', email: 'user@test.com', role: 'user' as const, createdAt: '', updatedAt: '' };
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);
      vi.mocked(usersApiModule.usersApi.getUserSavedPosts).mockResolvedValue({
        pagination: mockPagination,
        posts: mockPosts,
      });

      const result = await postsApi.getSavedPosts();

      expect(usersApiModule.usersApi.getUsersMe).toHaveBeenCalled();
      expect(result).toEqual(mockPosts);
    });

    it('должен передавать параметры поиска', async () => {
      const mockUser = { id: 1, login: 'user', email: 'user@test.com', role: 'user' as const, createdAt: '', updatedAt: '' };
      vi.mocked(usersApiModule.usersApi.getUsersMe).mockResolvedValue(mockUser);
      vi.mocked(usersApiModule.usersApi.getUserSavedPosts).mockResolvedValue({
        pagination: mockPagination,
        posts: [],
      });

      await postsApi.getSavedPosts({ q: 'test' });

      expect(usersApiModule.usersApi.getUserSavedPosts).toHaveBeenCalledWith(1, { q: 'test' });
    });
  });
});
