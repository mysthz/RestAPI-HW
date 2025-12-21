import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AuthorInfo } from './AuthorInfo';
import { APP_ROUTES } from '../shared/config/routes';
import { useAuth } from '../contexts/AuthContext';
import { useSavePost, useUnsavePost, useSavedPostIds } from '../hooks/usePosts';
import type { PostResponse } from '../shared/types';

type PostCardProps = {
  post: PostResponse;
};

function PostCard(props: PostCardProps) {
  const { post } = props;
  const { isAuthenticated } = useAuth();
  const { data: savedIds } = useSavedPostIds();
  const savePost = useSavePost();
  const unsavePost = useUnsavePost();

  const isSaved = savedIds?.includes(post.id) ?? false;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      unsavePost.mutate(post.id);
    } else {
      savePost.mutate(post.id);
    }
  };

  return (
    <Card className="transition-colors hover:bg-accent/50">
      <Link to={APP_ROUTES.postDetails(post.id)}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-medium leading-tight">{post.title}</CardTitle>
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleToggleSave}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-success" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <div className="w-fit">
            <AuthorInfo authorId={post.authorId} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
          <div className="flex flex-wrap items-center gap-2">
            {post.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export { PostCard };
