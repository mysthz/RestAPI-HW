export type UserRole = 'admin' | 'user';

export type UserResponse = {
  id: number;
  email: string;
  login: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type UserRequest = {
  email: string;
  login: string;
  password: string;
};

export type UserUpdateRequest = {
  email: string;
  login: string;
};

export type PaginationResponse = {
  total_items: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  next_page: number | null;
  prev_page: number | null;
};

export type UsersPaginationResponse = {
  pagination: PaginationResponse;
  users: UserResponse[];
};

export type PostResponse = {
  id: number;
  authorId: number;
  title: string;
  content: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
};

export type PostCreateRequest = {
  title: string;
  content: string;
  categoryIds?: number[];
};

export type PostUpdateRequest = {
  title: string;
  content: string;
  categoryIds?: number[];
};

export type PostsPaginationResponse = {
  pagination: PaginationResponse;
  posts: PostResponse[];
};

export type CommentResponse = {
  id: number;
  authorId: number;
  postId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentCreateRequest = {
  content: string;
};

export type CommentUpdateRequest = {
  content: string;
};

export type CategoryResponse = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryCreateRequest = {
  title: string;
};

export type CategoryUpdateRequest = {
  title: string;
};

export type CategoryPaginationResponse = {
  pagination: PaginationResponse;
  categories: CategoryResponse[];
};

export type SavedPostResponse = {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  updatedAt: string;
};

export type SubscribeResponse = {
  id: number;
  authorId: number;
  subscriberId: number;
  createdAt: string;
  updatedAt: string;
};

export type SubscribePaginationResponse = {
  pagination: PaginationResponse;
  subscribes: SubscribeResponse[];
};

export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_at: string;
};

export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

export type HTTPValidationError = {
  detail: ValidationError[];
};

export type LoginFormData = {
  username: string;
  password: string;
};
