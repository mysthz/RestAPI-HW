export const API_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
  },
  users: {
    list: '/api/users',
    me: '/api/users/me',
    byId: (userId: number) => `/api/users/${userId}`,
    subscriptions: (userId: number) => `/api/users/${userId}/subscriptions`,
    followers: (userId: number) => `/api/users/${userId}/followers`,
    posts: (userId: number) => `/api/users/${userId}/posts`,
    savedPosts: (userId: number) => `/api/users/${userId}/saved-posts`,
    subscribe: (authorId: number) => `/api/users/${authorId}/subscribe`,
  },
  posts: {
    list: '/api/posts',
    byId: (postId: number) => `/api/posts/${postId}`,
    comments: (postId: number) => `/api/posts/${postId}/comments`,
    commentById: (postId: number, commentId: number) => `/api/posts/${postId}/comments/${commentId}`,
    save: (postId: number) => `/api/posts/${postId}/save`,
  },
  categories: {
    list: '/api/categories',
    byId: (categoryId: number) => `/api/categories/${categoryId}`,
  },
} as const;
