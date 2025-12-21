import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { postsApi } from '../shared/api/posts';
import { APP_ROUTES } from '../shared/config/routes';
import type { PostCreateRequest, PostUpdateRequest } from '../shared/types';

function usePosts(params?: { q?: string; offset?: number; limit?: number }) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.getPosts(params),
  });
}

function usePost(postId: number) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getPost(postId),
    enabled: !!postId,
  });
}

function useCreatePost() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: PostCreateRequest) => postsApi.createPost(data),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Пост успешно создан');
      navigate(APP_ROUTES.postDetails(post.id));
    },
  });
}

function useUpdatePost(postId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: PostUpdateRequest) => postsApi.updatePost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      toast.success('Пост успешно обновлён');
      navigate(APP_ROUTES.postDetails(postId));
    },
  });
}

function useDeletePost() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (postId: number) => postsApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Пост удалён');
      navigate(APP_ROUTES.home);
    },
  });
}

function useSavedPostIds() {
  return useQuery({
    queryKey: ['savedPostIds'],
    queryFn: () => postsApi.getSavedPostIds(),
  });
}

function useSavedPosts(params?: { q?: string }) {
  return useQuery({
    queryKey: ['savedPosts', params],
    queryFn: () => postsApi.getSavedPosts(params),
  });
}

function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postsApi.savePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPostIds'] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['userSavedPosts'] });
      toast.success('Пост добавлен в избранное');
    },
  });
}

function useUnsavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postsApi.unsavePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPostIds'] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['userSavedPosts'] });
      toast.success('Пост удалён из избранного');
    },
  });
}

export {
  usePosts,
  usePost,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useSavedPostIds,
  useSavedPosts,
  useSavePost,
  useUnsavePost,
};
