import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import { randomUUID } from 'crypto';

// Database Schema
export interface DatabaseSchema {
  tasks: Task[];
  _meta: {
    version: string;
    createdAt: string;
  };
}

// Task Interface
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

// DTOs
export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  category?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'open' | 'completed';
  dueDate?: string;
  category?: string;
}

// Database Class
export class Database {
  private db!: Low<DatabaseSchema>;
  private dbPath: string;

  constructor(dbPath = './data/db.json') {
    this.dbPath = dbPath;
  }

  async init(): Promise<void> {
    // Create parent directory if it doesn't exist
    await mkdir(dirname(this.dbPath), { recursive: true });

    // Initialize database
    const adapter = new JSONFile<DatabaseSchema>(this.dbPath);
    this.db = new Low(adapter, this.getDefaultData());
    await this.db.read();

    // Initialize with default data if empty
    if (!this.db.data) {
      this.db.data = this.getDefaultData();
      await this.db.write();
    }
  }

  private getDefaultData(): DatabaseSchema {
    return {
      tasks: [],
      _meta: {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
      },
    };
  }

  // Task CRUD Operations

  async getTasks(filters?: {
    status?: 'open' | 'completed';
    category?: string;
    search?: string;
  }): Promise<Task[]> {
    await this.db.read();
    let tasks = this.db.data.tasks;

    // Apply filters
    if (filters?.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }

    if (filters?.category) {
      tasks = tasks.filter(t => t.category === filters.category);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      tasks = tasks.filter(
        t =>
          t.title.toLowerCase().includes(searchLower) ||
          (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }

    return tasks;
  }

  async getTaskById(id: string): Promise<Task | null> {
    await this.db.read();
    return this.db.data.tasks.find(t => t.id === id) || null;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    await this.db.read();

    const now = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      status: 'open',
      dueDate: data.dueDate,
      category: data.category,
      createdAt: now,
      updatedAt: now,
    };

    this.db.data.tasks.push(task);
    await this.db.write();

    return task;
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    await this.db.read();

    const taskIndex = this.db.data.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    const task = this.db.data.tasks[taskIndex];
    const updatedTask: Task = {
      ...task,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.db.data.tasks[taskIndex] = updatedTask;
    await this.db.write();

    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await this.db.read();

    const taskIndex = this.db.data.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    this.db.data.tasks.splice(taskIndex, 1);
    await this.db.write();
  }

  async toggleTask(id: string): Promise<Task> {
    await this.db.read();

    const taskIndex = this.db.data.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    const task = this.db.data.tasks[taskIndex];
    const updatedTask: Task = {
      ...task,
      status: task.status === 'open' ? 'completed' : 'open',
      updatedAt: new Date().toISOString(),
    };

    this.db.data.tasks[taskIndex] = updatedTask;
    await this.db.write();

    return updatedTask;
  }
}

// Export singleton instance
export const db = new Database();
