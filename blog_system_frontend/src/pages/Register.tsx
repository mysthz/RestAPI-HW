import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Layout } from '../components/Layout';
import { useRegister } from '../hooks/useAuth';
import { userRequestSchema, type UserRequestForm } from '../shared/schemas';
import { APP_ROUTES } from '../shared/config/routes';

function RegisterPage() {
  const register = useRegister();

  const form = useForm<UserRequestForm>({
    resolver: zodResolver(userRequestSchema),
    defaultValues: {
      email: '',
      login: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    register.mutate({ email: data.email, login: data.login, password: data.password });
  });

  return (
    <Layout>
      <div className="mx-auto max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>Создайте новый аккаунт</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="example@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Логин</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Введите логин" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Минимум 6 символов" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={register.isPending}>
                  {register.isPending ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
              </form>
            </Form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <Link to={APP_ROUTES.login} className="text-primary hover:underline">
                Войдите
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default RegisterPage;
