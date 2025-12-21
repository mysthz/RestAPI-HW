import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Layout } from '../components/Layout';
import { useLogin } from '../hooks/useAuth';
import { loginSchema, type LoginForm } from '../shared/schemas';
import { APP_ROUTES } from '../shared/config/routes';

function LoginPage() {
  const login = useLogin();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    login.mutate({ username: data.username, password: data.password });
  });

  return (
    <Layout>
      <div className="mx-auto max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Вход</CardTitle>
            <CardDescription>Войдите в свой аккаунт</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Логин или email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Введите логин или email" />
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
                        <Input {...field} type="password" placeholder="Введите пароль" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={login.isPending}>
                  {login.isPending ? 'Вход...' : 'Войти'}
                </Button>
              </form>
            </Form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <Link to={APP_ROUTES.register} className="text-primary hover:underline">
                Зарегистрируйтесь
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default LoginPage;
