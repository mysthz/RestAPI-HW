import { describe, it, expect } from 'vitest';
import { APP_ROUTES } from './routes';

describe('APP_ROUTES', () => {
  describe('статические маршруты', () => {
    it('должен иметь правильный путь home', () => {
      expect(APP_ROUTES.home).toBe('/');
    });

    it('должен иметь правильный путь login', () => {
      expect(APP_ROUTES.login).toBe('/login');
    });

    it('должен иметь правильный путь register', () => {
      expect(APP_ROUTES.register).toBe('/register');
    });

    it('должен иметь правильный путь postCreate', () => {
      expect(APP_ROUTES.postCreate).toBe('/posts/new');
    });

    it('должен иметь правильный путь favorites', () => {
      expect(APP_ROUTES.favorites).toBe('/favorites');
    });

    it('должен иметь правильный путь usersSearch', () => {
      expect(APP_ROUTES.usersSearch).toBe('/users');
    });
  });

  describe('динамические маршруты', () => {
    describe('postDetails', () => {
      it('должен формировать путь с числовым ID', () => {
        expect(APP_ROUTES.postDetails(1)).toBe('/posts/1');
        expect(APP_ROUTES.postDetails(123)).toBe('/posts/123');
      });

      it('должен формировать путь со строковым ID', () => {
        expect(APP_ROUTES.postDetails('1')).toBe('/posts/1');
        expect(APP_ROUTES.postDetails('abc')).toBe('/posts/abc');
      });
    });

    describe('postEdit', () => {
      it('должен формировать путь с числовым ID', () => {
        expect(APP_ROUTES.postEdit(1)).toBe('/posts/1/edit');
        expect(APP_ROUTES.postEdit(456)).toBe('/posts/456/edit');
      });

      it('должен формировать путь со строковым ID', () => {
        expect(APP_ROUTES.postEdit('1')).toBe('/posts/1/edit');
      });
    });

    describe('userProfile', () => {
      it('должен формировать путь с числовым ID', () => {
        expect(APP_ROUTES.userProfile(1)).toBe('/users/1');
        expect(APP_ROUTES.userProfile(789)).toBe('/users/789');
      });

      it('должен формировать путь со строковым ID', () => {
        expect(APP_ROUTES.userProfile('1')).toBe('/users/1');
      });
    });

    describe('userPosts', () => {
      it('должен формировать путь с числовым ID', () => {
        expect(APP_ROUTES.userPosts(1)).toBe('/users/1/posts');
      });

      it('должен формировать путь со строковым ID', () => {
        expect(APP_ROUTES.userPosts('1')).toBe('/users/1/posts');
      });
    });

    describe('userSavedPosts', () => {
      it('должен формировать путь с числовым ID', () => {
        expect(APP_ROUTES.userSavedPosts(1)).toBe('/users/1/saved-posts');
      });

      it('должен формировать путь со строковым ID', () => {
        expect(APP_ROUTES.userSavedPosts('1')).toBe('/users/1/saved-posts');
      });
    });

    describe('userSubscribers', () => {
      it('должен формировать путь с числовым ID', () => {
        expect(APP_ROUTES.userSubscribers(1)).toBe('/users/1/subscribers');
      });

      it('должен формировать путь со строковым ID', () => {
        expect(APP_ROUTES.userSubscribers('1')).toBe('/users/1/subscribers');
      });
    });

    describe('userSubscriptions', () => {
      it('должен формировать путь с числовым ID', () => {
        expect(APP_ROUTES.userSubscriptions(1)).toBe('/users/1/subscriptions');
      });

      it('должен формировать путь со строковым ID', () => {
        expect(APP_ROUTES.userSubscriptions('1')).toBe('/users/1/subscriptions');
      });
    });
  });
});
