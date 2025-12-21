import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { PostCard } from '../components/PostCard';
import { PageLoader } from '../components/ui/spinner';
import { ErrorMessage } from '../components/ui/error-message';
import { useUserSavedPosts } from '../hooks/useUsers';

function UserSavedPosts() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useUserSavedPosts(userId, {
    q: searchQuery || undefined,
  });

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по сохранённым..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading && <PageLoader />}
      {isError && <ErrorMessage message="Ошибка загрузки сохранённых постов" />}
      {data && (
        <div className="space-y-4">
          {data.posts.length === 0 ? (
            <p className="text-center text-muted-foreground">Сохранённые посты не найдены</p>
          ) : (
            data.posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}
    </div>
  );
}

export default UserSavedPosts;
