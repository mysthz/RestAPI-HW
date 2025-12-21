import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { APP_ROUTES } from './shared/config/routes';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserProfile from './pages/UserProfile';
import UserPosts from './pages/UserPosts';
import UserSavedPosts from './pages/UserSavedPosts';
import UserSubscribers from './pages/UserSubscribers';
import UserSubscriptions from './pages/UserSubscriptions';
import PostCreatePage from './pages/PostCreate';
import PostDetailsPage from './pages/PostDetails';
import PostEditPage from './pages/PostEdit';
import FavoritesPage from './pages/Favorites';
import UsersSearchPage from './pages/UsersSearch';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route
                  path={APP_ROUTES.home}
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route path={APP_ROUTES.login} element={<LoginPage />} />
                <Route path={APP_ROUTES.register} element={<RegisterPage />} />
                <Route
                  path={APP_ROUTES.usersSearch}
                  element={
                    <ProtectedRoute>
                      <UsersSearchPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users/:id"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                >
                  <Route path="posts" element={<UserPosts />} />
                  <Route path="saved-posts" element={<UserSavedPosts />} />
                  <Route path="subscribers" element={<UserSubscribers />} />
                  <Route path="subscriptions" element={<UserSubscriptions />} />
                </Route>
                <Route
                  path="/posts/:postId"
                  element={
                    <ProtectedRoute>
                      <PostDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.postCreate}
                  element={
                    <ProtectedRoute>
                      <PostCreatePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts/:postId/edit"
                  element={
                    <ProtectedRoute>
                      <PostEditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.favorites}
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
