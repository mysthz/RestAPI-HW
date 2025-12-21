import { describe, it, expect } from 'vitest';
import { API_ENDPOINTS } from './api';

describe('API_ENDPOINTS', () => {
  describe('auth', () => {
    it('должен иметь правильный путь register', () => {
      expect(API_ENDPOINTS.auth.register).toBe('/api/auth/register');
    });

    it('должен иметь правильный путь login', () => {
      expect(API_ENDPOINTS.auth.login).toBe('/api/auth/login');
    });
  });

  describe('users', () => {
    it('должен иметь правильный путь list', () => {
      expect(API_ENDPOINTS.users.list).toBe('/api/users');
    });

    it('должен иметь правильный путь me', () => {
      expect(API_ENDPOINTS.users.me).toBe('/api/users/me');
    });

    it('должен формировать правильный путь byId', () => {
      expect(API_ENDPOINTS.users.byId(1)).toBe('/api/users/1');
      expect(API_ENDPOINTS.users.byId(123)).toBe('/api/users/123');
    });

    it('должен формировать правильный путь subscriptions', () => {
      expect(API_ENDPOINTS.users.subscriptions(1)).toBe('/api/users/1/subscriptions');
    });

    it('должен формировать правильный путь followers', () => {
      expect(API_ENDPOINTS.users.followers(1)).toBe('/api/users/1/followers');
    });

    it('должен формировать правильный путь posts', () => {
      expect(API_ENDPOINTS.users.posts(1)).toBe('/api/users/1/posts');
    });

    it('должен формировать правильный путь savedPosts', () => {
      expect(API_ENDPOINTS.users.savedPosts(1)).toBe('/api/users/1/saved-posts');
    });

    it('должен формировать правильный путь subscribe', () => {
      expect(API_ENDPOINTS.users.subscribe(1)).toBe('/api/users/1/subscribe');
    });
  });

  describe('posts', () => {
    it('должен иметь правильный путь list', () => {
      expect(API_ENDPOINTS.posts.list).toBe('/api/posts');
    });

    it('должен формировать правильный путь byId', () => {
      expect(API_ENDPOINTS.posts.byId(1)).toBe('/api/posts/1');
      expect(API_ENDPOINTS.posts.byId(456)).toBe('/api/posts/456');
    });

    it('должен формировать правильный путь comments', () => {
      expect(API_ENDPOINTS.posts.comments(1)).toBe('/api/posts/1/comments');
    });

    it('должен формировать правильный путь commentById', () => {
      expect(API_ENDPOINTS.posts.commentById(1, 2)).toBe('/api/posts/1/comments/2');
    });

    it('должен формировать правильный путь save', () => {
      expect(API_ENDPOINTS.posts.save(1)).toBe('/api/posts/1/save');
    });
  });

  describe('categories', () => {
    it('должен иметь правильный путь list', () => {
      expect(API_ENDPOINTS.categories.list).toBe('/api/categories');
    });

    it('должен формировать правильный путь byId', () => {
      expect(API_ENDPOINTS.categories.byId(1)).toBe('/api/categories/1');
      expect(API_ENDPOINTS.categories.byId(789)).toBe('/api/categories/789');
    });
  });
});
