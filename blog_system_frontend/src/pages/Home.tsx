import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Layout } from '../components/Layout';
import { PostCard } from '../components/PostCard';
import { PageLoader } from '../components/ui/spinner';
import { ErrorMessage } from '../components/ui/error-message';
import { usePosts } from '../hooks/usePosts';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isError } = usePosts({ q: searchQuery || undefined });

  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск постов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading && <PageLoader />}
        {isError && <ErrorMessage message="Ошибка загрузки постов" />}
        {data && (
          <div className="space-y-4">
            {data.posts.length === 0 ? (
              <p className="text-center text-muted-foreground">Посты не найдены</p>
            ) : (
              data.posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default HomePage;
