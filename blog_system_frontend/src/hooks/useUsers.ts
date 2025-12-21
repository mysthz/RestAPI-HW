import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../shared/api/users';
import type { UserUpdateRequest } from '../shared/types';

function useUsers(params?: { q?: string; offset?: number; limit?: number }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params),
  });
}

function useUser(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getUser(userId),
    enabled: !!userId,
  });
}

function useUpdateUser(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdateRequest) => usersApi.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      toast.success('Профиль обновлён');
    },
  });
}

function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (authorId: number) => usersApi.subscribe(authorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      toast.success('Вы подписались');
    },
  });
}

function useUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (authorId: number) => usersApi.unsubscribe(authorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      toast.success('Вы отписались');
    },
  });
}

function useUserSubscriptions(userId?: number, params?: { q?: string; offset?: number; limit?: number }) {
  return useQuery({
    queryKey: ['subscriptions', userId, params],
    queryFn: () => usersApi.getUserSubscriptions(userId!, params),
    enabled: !!userId,
  });
}

function useUserFollowers(userId?: number, params?: { q?: string; offset?: number; limit?: number }) {
  return useQuery({
    queryKey: ['followers', userId, params],
    queryFn: () => usersApi.getUserFollowers(userId!, params),
    enabled: !!userId,
  });
}

function useUserPosts(userId?: number, params?: { q?: string; offset?: number; limit?: number }) {
  return useQuery({
    queryKey: ['userPosts', userId, params],
    queryFn: () => usersApi.getUserPosts(userId!, params),
    enabled: !!userId,
  });
}

function useUserSavedPosts(userId?: number, params?: { q?: string; offset?: number; limit?: number }) {
  return useQuery({
    queryKey: ['userSavedPosts', userId, params],
    queryFn: () => usersApi.getUserSavedPosts(userId!, params),
    enabled: !!userId,
  });
}

export {
  useUsers,
  useUser,
  useUpdateUser,
  useSubscribe,
  useUnsubscribe,
  useUserSubscriptions,
  useUserFollowers,
  useUserPosts,
  useUserSavedPosts,
};
