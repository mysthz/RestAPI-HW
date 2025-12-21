import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../shared/api/auth';
import { useAuth } from '../contexts/AuthContext';
import { APP_ROUTES } from '../shared/config/routes';
import type { UserRequest, LoginFormData } from '../shared/types';

function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: async (response) => {
      await login(response.access_token);
      toast.success('Вы успешно вошли в систему');
      navigate(APP_ROUTES.home);
    },
  });
}

function useRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UserRequest) => authApi.register(data),
    onSuccess: async (response) => {
      await login(response.access_token);
      toast.success('Регистрация прошла успешно');
      navigate(APP_ROUTES.home);
    },
  });
}

export { useLogin, useRegister };
