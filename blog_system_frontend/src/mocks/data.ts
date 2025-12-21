import type {
  UserResponse,
  PostResponse,
  CommentResponse,
  CategoryResponse,
  PaginationResponse,
} from '../shared/types';

const basePagination: PaginationResponse = {
  total_items: 10,
  total_pages: 1,
  current_page: 1,
  per_page: 10,
  has_next_page: false,
  has_prev_page: false,
  next_page: null,
  prev_page: null,
};

export const mockUsers: UserResponse[] = [
  {
    id: 1,
    email: 'admin@example.com',
    login: 'admin',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    email: 'user@example.com',
    login: 'user',
    role: 'user',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    email: 'developer@example.com',
    login: 'developer',
    role: 'user',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export const mockCategories: CategoryResponse[] = [
  { id: 1, title: 'Разработка', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 2, title: 'Дизайн', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 3, title: 'DevOps', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 4, title: 'Машинное обучение', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

export const mockPosts: PostResponse[] = [
  {
    id: 1,
    authorId: 1,
    title: 'Введение в React 18',
    content: 'React 18 принёс множество новых функций, включая автоматический батчинг, новые хуки и улучшенную поддержку Suspense. В этой статье мы рассмотрим основные изменения и как их использовать в ваших проектах.',
    categories: ['Разработка'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    authorId: 2,
    title: 'Лучшие практики TypeScript в 2024',
    content: 'TypeScript продолжает развиваться, и важно следить за лучшими практиками. Строгая типизация, использование utility types и правильная организация типов помогут сделать ваш код более надёжным.',
    categories: ['Разработка'],
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: 3,
    authorId: 3,
    title: 'Kubernetes для начинающих',
    content: 'Kubernetes — это платформа для автоматизации развёртывания, масштабирования и управления контейнеризированными приложениями. В этой статье мы разберём основные концепции: pods, services, deployments.',
    categories: ['DevOps'],
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z',
  },
  {
    id: 4,
    authorId: 1,
    title: 'Принципы хорошего UI/UX дизайна',
    content: 'Хороший дизайн интерфейса — это баланс между эстетикой и функциональностью. Пользователь должен интуитивно понимать, как взаимодействовать с приложением. Рассмотрим ключевые принципы.',
    categories: ['Дизайн'],
    createdAt: '2024-01-18T16:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
  },
  {
    id: 5,
    authorId: 2,
    title: 'Нейросети в продакшене',
    content: 'Развёртывание моделей машинного обучения в продакшен — сложная задача. Нужно учитывать производительность, масштабирование и мониторинг. MLOps практики помогают решить эти проблемы.',
    categories: ['Машинное обучение', 'DevOps'],
    createdAt: '2024-01-19T11:00:00Z',
    updatedAt: '2024-01-19T11:00:00Z',
  },
];

export const mockComments: CommentResponse[] = [
  {
    id: 1,
    authorId: 2,
    postId: 1,
    content: 'Отличная статья! Очень помогла разобраться с новыми функциями React.',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
  },
  {
    id: 2,
    authorId: 3,
    postId: 1,
    content: 'Спасибо за подробное объяснение. Было бы интересно увидеть примеры с Suspense.',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
  },
  {
    id: 3,
    authorId: 1,
    postId: 2,
    content: 'TypeScript действительно изменил подход к разработке на JavaScript.',
    createdAt: '2024-01-16T16:00:00Z',
    updatedAt: '2024-01-16T16:00:00Z',
  },
];

export const mockSavedPostIds: number[] = [1, 3];

export function getPagination(total: number, offset: number, limit: number): PaginationResponse {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  return {
    total_items: total,
    total_pages: totalPages,
    current_page: currentPage,
    per_page: limit,
    has_next_page: currentPage < totalPages,
    has_prev_page: currentPage > 1,
    next_page: currentPage < totalPages ? currentPage + 1 : null,
    prev_page: currentPage > 1 ? currentPage - 1 : null,
  };
}

export { basePagination };
