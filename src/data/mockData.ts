/**
 * Mock data for the Task Management App
 * This will be replaced with API calls later
 */

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  boardId: string;
  order: number;
  createdAt: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockBoards: Board[] = [
  {
    id: '1',
    title: 'Project Alpha',
    description: 'Main project board',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
  },
  {
    id: '2',
    title: 'Marketing Campaign',
    description: 'Q1 marketing initiatives',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-17T16:20:00Z',
  },
  {
    id: '3',
    title: 'Product Development',
    description: 'New features and improvements',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-18T11:15:00Z',
  },
];

export const mockTasks: Task[] = [
  // Board 1 tasks
  {
    id: '1',
    title: 'Design user interface',
    description: 'Create mockups for the main dashboard',
    status: 'TODO',
    boardId: '1',
    order: 0,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Setup development environment',
    description: 'Configure React Native and dependencies',
    status: 'IN_PROGRESS',
    boardId: '1',
    order: 0,
    createdAt: '2024-01-16T09:00:00Z',
  },
  {
    id: '3',
    title: 'Write unit tests',
    description: 'Add test coverage for core components',
    status: 'DONE',
    boardId: '1',
    order: 0,
    createdAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '4',
    title: 'Review code',
    description: 'Code review and feedback session',
    status: 'TODO',
    boardId: '1',
    order: 1,
    createdAt: '2024-01-18T08:00:00Z',
  },
  // Board 2 tasks
  {
    id: '5',
    title: 'Create social media content',
    description: 'Design posts for Instagram and Twitter',
    status: 'IN_PROGRESS',
    boardId: '2',
    order: 0,
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '6',
    title: 'Launch email campaign',
    description: 'Send newsletter to subscribers',
    status: 'DONE',
    boardId: '2',
    order: 0,
    createdAt: '2024-01-12T11:00:00Z',
  },
  {
    id: '7',
    title: 'Analyze campaign metrics',
    description: 'Review performance data',
    status: 'TODO',
    boardId: '2',
    order: 0,
    createdAt: '2024-01-15T14:00:00Z',
  },
  // Board 3 tasks
  {
    id: '8',
    title: 'Implement dark mode',
    description: 'Add theme switching functionality',
    status: 'TODO',
    boardId: '3',
    order: 0,
    createdAt: '2024-01-05T08:00:00Z',
  },
  {
    id: '9',
    title: 'Optimize performance',
    description: 'Reduce bundle size and improve load times',
    status: 'IN_PROGRESS',
    boardId: '3',
    order: 0,
    createdAt: '2024-01-08T10:00:00Z',
  },
];
