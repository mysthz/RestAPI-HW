import type {
  UserResponse,
  UsersPaginationResponse,
  PostResponse,
  PostsPaginationResponse,
  CommentResponse,
  CategoryResponse,
  CategoryPaginationResponse,
  AccessTokenResponse,
  SavedPostResponse,
  SubscribeResponse,
  SubscribePaginationResponse,
  PostCreateRequest,
  PostUpdateRequest,
  CommentCreateRequest,
  CommentUpdateRequest,
  UserUpdateRequest,
} from '../shared/types';
import {
  mockUsers,
  mockPosts,
  mockComments,
  mockCategories,
  mockSavedPostIds,
  getPagination,
} from './data';

let posts = [...mockPosts];
let comments = [...mockComments];
let savedPostIds = [...mockSavedPostIds];
let currentUserId: number | null = 1;
let nextPostId = posts.length + 1;
let nextCommentId = comments.length + 1;

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export const mockAuthService = {
  register: async (): Promise<AccessTokenResponse> => {
    currentUserId = 2;
    return delay({
      access_token: 'mock_token_123',
      token_type: 'bearer',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    });
  },
  login: async (): Promise<AccessTokenResponse> => {
    currentUserId = 1;
    return delay({
      access_token: 'mock_token_123',
      token_type: 'bearer',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    });
  },
};

export const mockUsersService = {
  getUsers: async (q?: string, offset = 0, limit = 100): Promise<UsersPaginationResponse> => {
    let filtered = mockUsers;
    if (q) {
      filtered = mockUsers.filter(
        (u) => u.login.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())
      );
    }
    const paginated = filtered.slice(offset, offset + limit);
    return delay({
      pagination: getPagination(filtered.length, offset, limit),
      users: paginated,
    });
  },
  getUser: async (userId: number): Promise<UserResponse> => {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    return delay(user);
  },
  getCurrentUser: async (): Promise<UserResponse | null> => {
    if (!currentUserId) return delay(null);
    const user = mockUsers.find((u) => u.id === currentUserId);
    return delay(user || null);
  },
  updateUser: async (userId: number, data: UserUpdateRequest): Promise<UserResponse> => {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.email = data.email;
    user.login = data.login;
    user.updatedAt = new Date().toISOString();
    return delay(user);
  },
  getUserSubscriptions: async (userId: number, offset = 0, limit = 100): Promise<SubscribePaginationResponse> => {
    return delay({
      pagination: getPagination(0, offset, limit),
      subscribes: [],
    });
  },
  getUserFollowers: async (userId: number, offset = 0, limit = 100): Promise<SubscribePaginationResponse> => {
    return delay({
      pagination: getPagination(0, offset, limit),
      subscribes: [],
    });
  },
  subscribe: async (authorId: number): Promise<SubscribeResponse> => {
    return delay({
      id: 1,
      authorId,
      subscriberId: currentUserId || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
  unsubscribe: async (): Promise<void> => {
    return delay(undefined);
  },
};

export const mockPostsService = {
  getPosts: async (q?: string, offset = 0, limit = 100): Promise<PostsPaginationResponse> => {
    let filtered = posts;
    if (q) {
      filtered = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.content.toLowerCase().includes(q.toLowerCase())
      );
    }
    const paginated = filtered.slice(offset, offset + limit);
    return delay({
      pagination: getPagination(filtered.length, offset, limit),
      posts: paginated,
    });
  },
  getPost: async (postId: number): Promise<PostResponse> => {
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');
    return delay(post);
  },
  createPost: async (data: PostCreateRequest): Promise<PostResponse> => {
    const categoryTitles = data.categoryIds
      ? mockCategories.filter((c) => data.categoryIds?.includes(c.id)).map((c) => c.title)
      : [];
    const post: PostResponse = {
      id: nextPostId++,
      authorId: currentUserId || 1,
      title: data.title,
      content: data.content,
      categories: categoryTitles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.unshift(post);
    return delay(post);
  },
  updatePost: async (postId: number, data: PostUpdateRequest): Promise<PostResponse> => {
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');
    const categoryTitles = data.categoryIds
      ? mockCategories.filter((c) => data.categoryIds?.includes(c.id)).map((c) => c.title)
      : post.categories;
    post.title = data.title;
    post.content = data.content;
    post.categories = categoryTitles;
    post.updatedAt = new Date().toISOString();
    return delay(post);
  },
  deletePost: async (postId: number): Promise<void> => {
    posts = posts.filter((p) => p.id !== postId);
    return delay(undefined);
  },
  getComments: async (postId: number): Promise<CommentResponse[]> => {
    const postComments = comments.filter((c) => c.postId === postId);
    return delay(postComments);
  },
  createComment: async (postId: number, data: CommentCreateRequest): Promise<CommentResponse> => {
    const comment: CommentResponse = {
      id: nextCommentId++,
      authorId: currentUserId || 1,
      postId,
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    comments.push(comment);
    return delay(comment);
  },
  updateComment: async (postId: number, commentId: number, data: CommentUpdateRequest): Promise<CommentResponse> => {
    const comment = comments.find((c) => c.id === commentId && c.postId === postId);
    if (!comment) throw new Error('Comment not found');
    comment.content = data.content;
    comment.updatedAt = new Date().toISOString();
    return delay(comment);
  },
  deleteComment: async (postId: number, commentId: number): Promise<void> => {
    comments = comments.filter((c) => !(c.id === commentId && c.postId === postId));
    return delay(undefined);
  },
  savePost: async (postId: number): Promise<SavedPostResponse> => {
    if (!savedPostIds.includes(postId)) {
      savedPostIds.push(postId);
    }
    return delay({
      id: savedPostIds.length,
      userId: currentUserId || 1,
      postId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
  unsavePost: async (postId: number): Promise<void> => {
    savedPostIds = savedPostIds.filter((id) => id !== postId);
    return delay(undefined);
  },
  getSavedPostIds: async (): Promise<number[]> => {
    return delay([...savedPostIds]);
  },
  getSavedPosts: async (q?: string): Promise<PostResponse[]> => {
    let saved = posts.filter((p) => savedPostIds.includes(p.id));
    if (q) {
      saved = saved.filter(
        (p) =>
          p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.content.toLowerCase().includes(q.toLowerCase())
      );
    }
    return delay(saved);
  },
};

export const mockCategoriesService = {
  getCategories: async (q?: string, offset = 0, limit = 100): Promise<CategoryPaginationResponse> => {
    let filtered = mockCategories;
    if (q) {
      filtered = mockCategories.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));
    }
    const paginated = filtered.slice(offset, offset + limit);
    return delay({
      pagination: getPagination(filtered.length, offset, limit),
      categories: paginated,
    });
  },
  getCategory: async (categoryId: number): Promise<CategoryResponse> => {
    const category = mockCategories.find((c) => c.id === categoryId);
    if (!category) throw new Error('Category not found');
    return delay(category);
  },
};

export function setMockCurrentUser(userId: number | null) {
  currentUserId = userId;
}
