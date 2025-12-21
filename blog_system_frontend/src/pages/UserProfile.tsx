import { useState } from 'react';
import { Link, Outlet, useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, FileText, Bookmark, Users, UserCheck, UserPlus, UserMinus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Layout } from '../components/Layout';
import { PageLoader } from '../components/ui/spinner';
import { ErrorMessage } from '../components/ui/error-message';
import { useAuth } from '../contexts/AuthContext';
import {
  useUser,
  useUpdateUser,
  useUserSubscriptions,
  useUserFollowers,
  useUserPosts,
  useUserSavedPosts,
  useSubscribe,
  useUnsubscribe,
} from '../hooks/useUsers';
import { userUpdateSchema, type UserUpdateForm } from '../shared/schemas';
import { APP_ROUTES } from '../shared/config/routes';

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  count: number;
  to: string;
  isActive: boolean;
};

function StatCard(props: StatCardProps) {
  const { icon, label, count, to, isActive } = props;
  return (
    <Link to={to}>
      <Card className={`transition-colors hover:bg-muted/50 ${isActive ? 'border-primary bg-muted/30' : ''}`}>
        <CardContent className="flex flex-col items-center gap-2 p-4">
          {icon}
          <span className="text-2xl font-bold">{count}</span>
          <span className="text-sm text-muted-foreground">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const userId = Number(id);
  const { user: currentUser, isAuthenticated, refreshUser } = useAuth();
  const isOwner = currentUser?.id === userId;
  const [editOpen, setEditOpen] = useState(false);

  const { data: profileUser, isLoading, isError } = useUser(userId);
  const { data: subscriptionsData, refetch: refetchSubscriptions } = useUserSubscriptions(userId);
  const { data: followersData } = useUserFollowers(userId);
  const { data: postsData } = useUserPosts(userId);
  const { data: savedPostsData, refetch: refetchSavedPosts } = useUserSavedPosts(isOwner ? userId : undefined);

  const currentUserSubscriptions = useUserSubscriptions(currentUser?.id);
  const subscribe = useSubscribe();
  const unsubscribe = useUnsubscribe();

  const isSubscribed = currentUserSubscriptions?.data?.subscribes?.some((sub) => sub.authorId === userId) ?? false;
  const canSubscribe = isAuthenticated && !isOwner;

  const handleSubscribe = () => {
    subscribe.mutate(userId, {
      onSuccess: () => {
        refetchSubscriptions();
      },
    });
  };

  const handleUnsubscribe = () => {
    unsubscribe.mutate(userId, {
      onSuccess: () => {
        refetchSubscriptions();
      },
    });
  };

  const updateUser = useUpdateUser(userId);

  const form = useForm<UserUpdateForm>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      email: profileUser?.email ?? '',
      login: profileUser?.login ?? '',
    },
  });

  const handleEditOpen = (open: boolean) => {
    if (open && profileUser) {
      form.reset({
        email: profileUser.email,
        login: profileUser.login,
      });
    }
    setEditOpen(open);
  };

  const handleSubmit = form.handleSubmit((data) => {
    updateUser.mutate(
      { email: data.email, login: data.login },
      {
        onSuccess: () => {
          refreshUser();
          setEditOpen(false);
        },
      }
    );
  });

  if (isLoading) return <Layout><PageLoader /></Layout>;
  if (isError || !profileUser) return <Layout><ErrorMessage message="Пользователь не найден" /></Layout>;

  const followersCount = followersData?.pagination.total_items ?? 0;
  const subscriptionsCount = subscriptionsData?.pagination.total_items ?? 0;
  const postsCount = postsData?.pagination.total_items ?? 0;
  const savedPostsCount = savedPostsData?.pagination.total_items ?? 0;

  const basePath = `/users/${userId}`;
  const currentPath = location.pathname;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">@{profileUser.login}</h1>
                <Badge variant={profileUser.role === 'admin' ? 'default' : 'secondary'}>
                  {profileUser.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </Badge>
              </div>
              <p className="text-muted-foreground">{profileUser.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canSubscribe && (
              isSubscribed ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnsubscribe}
                  disabled={unsubscribe.isPending}
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  Отписаться
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSubscribe}
                  disabled={subscribe.isPending}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Подписаться
                </Button>
              )
            )}
            {isOwner && (
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Редактировать
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Редактировать профиль</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="login"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Логин</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={updateUser.isPending} className="w-full">
                      {updateUser.isPending ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            )}
          </div>
        </div>

        <div className={`mb-8 grid grid-cols-2 gap-4 ${isOwner ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
          <StatCard
            icon={<Users className="h-6 w-6 text-muted-foreground" />}
            label="Подписчики"
            count={followersCount}
            to={APP_ROUTES.userSubscribers(userId)}
            isActive={currentPath.includes('/subscribers')}
          />
          <StatCard
            icon={<UserCheck className="h-6 w-6 text-muted-foreground" />}
            label="Подписки"
            count={subscriptionsCount}
            to={APP_ROUTES.userSubscriptions(userId)}
            isActive={currentPath.includes('/subscriptions')}
          />
          <StatCard
            icon={<FileText className="h-6 w-6 text-muted-foreground" />}
            label="Посты"
            count={postsCount}
            to={APP_ROUTES.userPosts(userId)}
            isActive={currentPath.includes('/posts')}
          />
          {isOwner && (
            <StatCard
              icon={<Bookmark className="h-6 w-6 text-muted-foreground" />}
              label="Сохранённые"
              count={savedPostsCount}
              to={APP_ROUTES.userSavedPosts(userId)}
              isActive={currentPath.includes('/saved-posts')}
            />
          )}
        </div>

        {currentPath === basePath ? (
          <div className="text-center text-muted-foreground">
            Выберите раздел выше для просмотра
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </Layout>
  );
}

export default UserProfile;
