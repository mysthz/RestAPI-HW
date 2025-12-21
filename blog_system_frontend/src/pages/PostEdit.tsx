import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Layout } from '../components/Layout';
import { PageLoader } from '../components/ui/spinner';
import { ErrorMessage } from '../components/ui/error-message';
import { usePost, useUpdatePost } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';
import { postUpdateSchema, type PostUpdateForm } from '../shared/schemas';
import { APP_ROUTES } from '../shared/config/routes';

function PostEditPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const id = Number(postId);

  const { data: post, isLoading: postLoading, isError } = usePost(id);
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const updatePost = useUpdatePost(id);

  const form = useForm<PostUpdateForm>({
    resolver: zodResolver(postUpdateSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryIds: [],
    },
  });

  useEffect(() => {
    if (post && categoriesData) {
      const categoryIds = categoriesData.categories
        .filter((c) => post.categories.includes(c.title))
        .map((c) => c.id);
      form.reset({
        title: post.title,
        content: post.content,
        categoryIds,
      });
    }
  }, [post, categoriesData, form]);

  const handleSubmit = form.handleSubmit((data) => {
    updatePost.mutate({ title: data.title, content: data.content, categoryIds: data.categoryIds });
  });

  if (postLoading || categoriesLoading) {
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

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Редактирование поста</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Заголовок</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Введите заголовок" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Содержание</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Напишите что-нибудь интересное..." rows={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>Категории</FormLabel>
                      <div className="flex flex-wrap gap-3">
                        {categoriesData?.categories.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="categoryIds"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, category.id]);
                                      } else {
                                        field.onChange(current.filter((cid) => cid !== category.id));
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-normal">
                                  {category.title}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={updatePost.isPending}>
                    {updatePost.isPending ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(APP_ROUTES.postDetails(id))}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default PostEditPage;
