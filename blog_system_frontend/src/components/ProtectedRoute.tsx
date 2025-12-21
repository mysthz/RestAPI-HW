import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_ROUTES } from '../shared/config/routes';
import { FullPageLoader } from './ui/spinner';
import { type ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute(props: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} state={{ from: location }} replace />;
  }

  return <>{props.children}</>;
}

export { ProtectedRoute };
