import { create } from 'zustand';
import { Task } from '../data/mockData';
import { mockTasks } from '../data/mockData';

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  getTasksByBoard: (boardId: string) => Task[];
  getTasksByStatus: (boardId: string, status: Task['status']) => Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task['status'], newOrder: number) => void;
  reorderTasks: (taskIds: string[], status: Task['status'], boardId: string) => void;
  initializeTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  
  setTasks: (tasks) => set({ tasks }),
  
  getTasksByBoard: (boardId) => {
    return get().tasks.filter((task) => task.boardId === boardId);
  },
  
  getTasksByStatus: (boardId, status) => {
    return get()
      .tasks.filter((task) => task.boardId === boardId && task.status === status)
      .sort((a, b) => a.order - b.order);
  },
  
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  
  moveTask: (taskId, newStatus, newOrder) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, order: newOrder }
          : task
      ),
    })),
  
  reorderTasks: (taskIds, status, boardId) =>
    set((state) => {
      const updatedTasks = [...state.tasks];
      
      taskIds.forEach((taskId, index) => {
        const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            status,
            order: index,
          };
        }
      });
      
      return { tasks: updatedTasks };
    }),
  
  initializeTasks: () => set({ tasks: mockTasks }),
}));
