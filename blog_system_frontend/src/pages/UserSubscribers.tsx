import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { PageLoader } from '../components/ui/spinner';
import { ErrorMessage } from '../components/ui/error-message';
import { useUserFollowers, useUser } from '../hooks/useUsers';
import { APP_ROUTES } from '../shared/config/routes';

type SubscriberCardProps = {
  subscriberId: number;
};

function SubscriberCard(props: SubscriberCardProps) {
  const { subscriberId } = props;
  const { data: user } = useUser(subscriberId);

  if (!user) {
    return (
      <Card>
        <CardContent className="py-4">
          <span className="text-muted-foreground">Загрузка...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link to={APP_ROUTES.userProfile(user.id)}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium">@{user.login}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
            {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

function UserSubscribers() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useUserFollowers(userId, {
    q: searchQuery || undefined,
  });

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по подписчикам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading && <PageLoader />}
      {isError && <ErrorMessage message="Ошибка загрузки подписчиков" />}
      {data && (
        <div className="flex flex-col gap-4">
          {data.subscribes.length === 0 ? (
            <p className="text-center text-muted-foreground">Подписчики не найдены</p>
          ) : (
            data.subscribes.map((sub) => (
              <SubscriberCard key={sub.id} subscriberId={sub.subscriberId} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default UserSubscribers;
