import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api';
import { MOCK_API } from '../config/env';
import { mockPostsService } from '../../mocks/services';
import type {
  PostResponse,
  PostsPaginationResponse,
  PostCreateRequest,
  PostUpdateRequest,
  CommentResponse,
  CommentCreateRequest,
  CommentUpdateRequest,
  SavedPostResponse,
} from '../types';
import { usersApi } from './users';

export const postsApi = {
  getPosts: async (params?: { q?: string; offset?: number; limit?: number }): Promise<PostsPaginationResponse> => {
    if (MOCK_API) {
      return mockPostsService.getPosts(params?.q, params?.offset, params?.limit);
    }
    const response = await apiClient.get<PostsPaginationResponse>(API_ENDPOINTS.posts.list, { params });
    return response.data;
  },

  getPost: async (postId: number): Promise<PostResponse> => {
    if (MOCK_API) {
      return mockPostsService.getPost(postId);
    }
    const response = await apiClient.get<PostResponse>(API_ENDPOINTS.posts.byId(postId));
    return response.data;
  },

  createPost: async (data: PostCreateRequest): Promise<PostResponse> => {
    if (MOCK_API) {
      return mockPostsService.createPost(data);
    }
    const response = await apiClient.post<PostResponse>(API_ENDPOINTS.posts.list, data);
    return response.data;
  },

  updatePost: async (postId: number, data: PostUpdateRequest): Promise<PostResponse> => {
    if (MOCK_API) {
      return mockPostsService.updatePost(postId, data);
    }
    const response = await apiClient.put<PostResponse>(API_ENDPOINTS.posts.byId(postId), data);
    return response.data;
  },

  deletePost: async (postId: number): Promise<void> => {
    if (MOCK_API) {
      return mockPostsService.deletePost(postId);
    }
    await apiClient.delete(API_ENDPOINTS.posts.byId(postId));
  },

  getComments: async (postId: number): Promise<CommentResponse[]> => {
    if (MOCK_API) {
      return mockPostsService.getComments(postId);
    }
    const response = await apiClient.get<CommentResponse[]>(API_ENDPOINTS.posts.comments(postId));
    return response.data;
  },

  createComment: async (postId: number, data: CommentCreateRequest): Promise<CommentResponse> => {
    if (MOCK_API) {
      return mockPostsService.createComment(postId, data);
    }
    const response = await apiClient.post<CommentResponse>(API_ENDPOINTS.posts.comments(postId), data);
    return response.data;
  },

  updateComment: async (
    postId: number,
    commentId: number,
    data: CommentUpdateRequest
  ): Promise<CommentResponse> => {
    if (MOCK_API) {
      return mockPostsService.updateComment(postId, commentId, data);
    }
    const response = await apiClient.put<CommentResponse>(
      API_ENDPOINTS.posts.commentById(postId, commentId),
      data
    );
    return response.data;
  },

  deleteComment: async (postId: number, commentId: number): Promise<void> => {
    if (MOCK_API) {
      return mockPostsService.deleteComment(postId, commentId);
    }
    await apiClient.delete(API_ENDPOINTS.posts.commentById(postId, commentId));
  },

  savePost: async (postId: number): Promise<SavedPostResponse> => {
    if (MOCK_API) {
      return mockPostsService.savePost(postId);
    }
    const response = await apiClient.post<SavedPostResponse>(API_ENDPOINTS.posts.save(postId));
    return response.data;
  },

  unsavePost: async (postId: number): Promise<void> => {
    if (MOCK_API) {
      return mockPostsService.unsavePost(postId);
    }
    await apiClient.delete(API_ENDPOINTS.posts.save(postId));
  },

  getSavedPostIds: async (): Promise<number[]> => {
    if (MOCK_API) {
      return mockPostsService.getSavedPostIds();
    }
    const user = await usersApi.getUsersMe()
    return (await usersApi.getUserSavedPosts(user.id)).posts.map(post => post.id);
  },

  getSavedPosts: async (params?: { q?: string }): Promise<PostResponse[]> => {
    if (MOCK_API) {
      return mockPostsService.getSavedPosts(params?.q);
    }
    const user = await usersApi.getUsersMe()
    return (await usersApi.getUserSavedPosts(user.id, params)).posts;
  },
};
