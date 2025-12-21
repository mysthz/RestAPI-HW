import { Link } from 'react-router-dom';
import { UserPlus, UserMinus } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import {
  useUser,
  useSubscribe,
  useUnsubscribe,
  useUserSubscriptions,
} from '../hooks/useUsers';
import { APP_ROUTES } from '../shared/config/routes';

type AuthorInfoProps = {
  authorId: number;
  showSubscribe?: boolean;
  size?: 'sm' | 'md';
};

function AuthorInfo(props: AuthorInfoProps) {
  const { authorId, showSubscribe = false, size = 'sm' } = props;
  const { user, isAuthenticated } = useAuth();
  const { data: author } = useUser(authorId);
  const subscribe = useSubscribe();
  const unsubscribe = useUnsubscribe();
  const subscriptions = useUserSubscriptions(user?.id);

  const isOwnProfile = user?.id === authorId;
  const canSubscribe = showSubscribe && isAuthenticated && !isOwnProfile;

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    subscribe.mutate(authorId);
  };

  const handleUnsubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    unsubscribe.mutate(authorId);
  };

  if (!author) {
    return <span className="text-muted-foreground">Загрузка...</span>;
  }

  if (size === 'sm') {
    return (
      <Link
        to={APP_ROUTES.userProfile(authorId)}
        className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        @{author.login}
      </Link>
    );
  }

  const isSubscribed = subscriptions?.data?.subscribes?.map((sub) => sub.authorId).includes(author.id);

  return (
    <div className="flex items-center gap-2">
      <Link
        to={APP_ROUTES.userProfile(authorId)}
        className="text-sm font-medium hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        @{author.login}
      </Link>
      {canSubscribe && (
        isSubscribed ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleUnsubscribe}
            disabled={unsubscribe.isPending}
          >
            <UserMinus className="mr-1 h-3 w-3" />
            Отписаться
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleSubscribe}
            disabled={subscribe.isPending}
          >
            <UserPlus className="mr-1 h-3 w-3" />
            Подписаться
          </Button>
        )
      )}
    </div>
  );
}

export { AuthorInfo };
