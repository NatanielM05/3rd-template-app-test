import axios from 'axios';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'completed';
  dueDate?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: 'open' | 'completed';
  dueDate?: string;
  category?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'open' | 'completed';
  dueDate?: string;
  category?: string;
}

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  getTasks: async (status?: 'open' | 'completed'): Promise<Task[]> => {
    const params = status ? { status } : {};
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (input: CreateTaskInput): Promise<Task> => {
    const response = await api.post<Task>('/tasks', input);
    return response.data;
  },

  updateTask: async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, input);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

export default api;
