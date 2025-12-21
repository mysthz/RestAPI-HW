import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { AuthorInfo } from './AuthorInfo';
import { useAuth } from '../contexts/AuthContext';
import { usePostComments, useCreateComment, useUpdateComment, useDeleteComment } from '../hooks/useComments';
import { commentCreateSchema, commentUpdateSchema, type CommentCreateForm } from '../shared/schemas';
import { PageLoader } from './ui/spinner';
import { ErrorMessage } from './ui/error-message';
import type { CommentResponse } from '../shared/types';

type CommentItemProps = {
  comment: CommentResponse;
  postId: number;
};

function CommentItem(props: CommentItemProps) {
  const { comment, postId } = props;
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const updateComment = useUpdateComment(postId);
  const deleteComment = useDeleteComment(postId);

  const form = useForm({
    resolver: zodResolver(commentUpdateSchema),
    defaultValues: { content: comment.content },
  });

  const isAuthor = user?.id === comment.authorId;
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleUpdate = form.handleSubmit((data) => {
    updateComment.mutate({ commentId: comment.id, data }, { onSuccess: () => setIsEditing(false) });
  });

  const handleDelete = () => {
    if (confirm('Удалить комментарий?')) {
      deleteComment.mutate(comment.id);
    }
  };

  if (isEditing) {
    return (
      <div className="border-b border-border py-3">
        <Form {...form}>
          <form onSubmit={handleUpdate}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2 flex gap-2">
              <Button type="submit" size="sm" disabled={updateComment.isPending}>
                <Check className="mr-1 h-3 w-3" />
                Сохранить
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                <X className="mr-1 h-3 w-3" />
                Отмена
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="border-b border-border py-3 last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <AuthorInfo authorId={comment.authorId} />
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
        {isAuthor && (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={handleDelete}
              disabled={deleteComment.isPending}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

type CommentFormProps = {
  postId: number;
};

function CommentForm(props: CommentFormProps) {
  const { postId } = props;
  const createComment = useCreateComment(postId);

  const form = useForm<CommentCreateForm>({
    resolver: zodResolver(commentCreateSchema),
    defaultValues: { content: '' },
  });

  const handleSubmit = form.handleSubmit((data) => {
    createComment.mutate({ content: data.content }, { onSuccess: () => form.reset() });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="mb-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} placeholder="Написать комментарий..." rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" className="mt-2" disabled={createComment.isPending}>
          Отправить
        </Button>
      </form>
    </Form>
  );
}

type CommentsProps = {
  postId: number;
};

function Comments(props: CommentsProps) {
  const { postId } = props;
  const { isAuthenticated } = useAuth();
  const { data: comments, isLoading, isError } = usePostComments(postId);

  if (isLoading) return <PageLoader />;
  if (isError) return <ErrorMessage message="Ошибка загрузки комментариев" />;

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-medium">Комментарии ({comments?.length ?? 0})</h3>
      {isAuthenticated && <CommentForm postId={postId} />}
      <div>
        {comments?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
        {comments?.length === 0 && (
          <p className="text-sm text-muted-foreground">Комментариев пока нет</p>
        )}
      </div>
    </div>
  );
}

export { Comments };
