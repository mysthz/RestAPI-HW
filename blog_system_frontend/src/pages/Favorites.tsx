import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Layout } from '../components/Layout';
import { PostCard } from '../components/PostCard';
import { PageLoader } from '../components/ui/spinner';
import { ErrorMessage } from '../components/ui/error-message';
import { useSavedPosts } from '../hooks/usePosts';

function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: posts, isLoading, isError } = useSavedPosts({ q: searchQuery || undefined });

  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-semibold">Избранное</h1>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск в избранном..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading && <PageLoader />}
        {isError && <ErrorMessage message="Ошибка загрузки избранного" />}
        {posts && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {searchQuery ? 'Посты не найдены' : 'У вас пока нет избранных постов'}
              </p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default FavoritesPage;
