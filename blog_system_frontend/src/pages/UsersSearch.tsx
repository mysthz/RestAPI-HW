import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Layout } from '../components/Layout';
import { PageLoader } from '../components/ui/spinner';
import { ErrorMessage } from '../components/ui/error-message';
import { useUsers } from '../hooks/useUsers';
import { APP_ROUTES } from '../shared/config/routes';

function UsersSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isError } = useUsers({ q: searchQuery || undefined });

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold">Пользователи</h1>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск пользователей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading && <PageLoader />}
        {isError && <ErrorMessage message="Ошибка загрузки пользователей" />}
        {data && (
          <div className="flex flex-col gap-4">
            {data.users.length === 0 ? (
              <p className="text-center text-muted-foreground">Пользователи не найдены</p>
            ) : (
              data.users.map((user) => (
                <Link key={user.id} to={APP_ROUTES.userProfile(user.id)}>
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
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UsersSearchPage;
