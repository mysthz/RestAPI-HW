import { useParams, Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Layout } from '../components/Layout';
import { Comments } from '../components/Comments';
import { AuthorInfo } from '../components/AuthorInfo';
import { PageLoader } from '../components/ui/spinner';
import { ErrorMessage } from '../components/ui/error-message';
import { useAuth } from '../contexts/AuthContext';
import { usePost, useDeletePost, useSavePost, useUnsavePost, useSavedPostIds } from '../hooks/usePosts';
import { APP_ROUTES } from '../shared/config/routes';

function PostDetailsPage() {
  const { postId } = useParams<{ postId: string }>();
  const { user, isAuthenticated } = useAuth();
  const id = Number(postId);

  const { data: post, isLoading, isError } = usePost(id);
  const { data: savedIds } = useSavedPostIds();
  const deletePost = useDeletePost();
  const savePost = useSavePost();
  const unsavePost = useUnsavePost();

  const isAuthor = user?.id === post?.authorId;
  const isSaved = savedIds?.includes(id) ?? false;

  const handleDelete = () => {
    if (confirm('Удалить пост?')) {
      deletePost.mutate(id);
    }
  };

  const handleToggleSave = () => {
    if (isSaved) {
      unsavePost.mutate(id);
    } else {
      savePost.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  if (isError || !post) {
    return (
      <Layout>
        <ErrorMessage message="Пост не найден" />
      </Layout>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Layout>
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <div className="mt-2 flex items-center gap-3">
                  <AuthorInfo authorId={post.authorId} showSubscribe size="md" />
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{formattedDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {isAuthenticated && (
                  <Button variant="ghost" size="icon" onClick={handleToggleSave}>
                    {isSaved ? (
                      <BookmarkCheck className="h-5 w-5 text-success" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                )}
                {isAuthor && (
                  <>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={APP_ROUTES.postEdit(post.id)}>
                        <Pencil className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={handleDelete}
                      disabled={deletePost.isPending}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            {post.categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-foreground">{post.content}</div>
          </CardContent>
        </Card>

        <Comments postId={id} />
      </div>
    </Layout>
  );
}

export default PostDetailsPage;
