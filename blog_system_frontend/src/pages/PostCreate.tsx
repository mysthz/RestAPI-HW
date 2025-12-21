import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Layout } from '../components/Layout';
import { useCreatePost } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';
import { postCreateSchema, type PostCreateForm } from '../shared/schemas';
import { APP_ROUTES } from '../shared/config/routes';
import { PageLoader } from '../components/ui/spinner';

function PostCreatePage() {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const form = useForm<PostCreateForm>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryIds: [],
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    createPost.mutate({ title: data.title, content: data.content, categoryIds: data.categoryIds });
  });

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Новый пост</CardTitle>
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
                      {categoriesLoading ? (
                        <PageLoader />
                      ) : (
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
                                          field.onChange(current.filter((id) => id !== category.id));
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
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={createPost.isPending}>
                    {createPost.isPending ? 'Создание...' : 'Создать'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate(APP_ROUTES.home)}>
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

export default PostCreatePage;
