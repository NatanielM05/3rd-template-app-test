import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { db } from '@app/database';
import type { CreateTaskDto, UpdateTaskDto } from '@app/database';
import { NotFoundError, BadRequestError } from '../middleware/error-handler.js';

export const tasksRouter: Router = Router();

// GET /api/v1/tasks - List all tasks with filters
tasksRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, category, search, sortBy = 'dueDate', sortOrder = 'asc' } = req.query;

    // Get tasks with filters
    const tasks = await db.getTasks({
      status: status as 'open' | 'completed' | undefined,
      category: category as string | undefined,
      search: search as string | undefined,
    });

    // Sort tasks
    const sortedTasks = [...tasks].sort((a, b) => {
      const field = sortBy as 'dueDate' | 'createdAt' | 'title';
      const order = sortOrder === 'asc' ? 1 : -1;

      if (field === 'dueDate') {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return (aDate - bDate) * order;
      }

      if (field === 'createdAt') {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return (aDate - bDate) * order;
      }

      if (field === 'title') {
        return a.title.localeCompare(b.title) * order;
      }

      return 0;
    });

    res.json({
      tasks: sortedTasks,
      total: sortedTasks.length,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/tasks - Create a new task
tasksRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, dueDate, category } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new BadRequestError('Title is required and must be a non-empty string');
    }

    if (title.length > 200) {
      throw new BadRequestError('Title must be at most 200 characters');
    }

    if (description && typeof description !== 'string') {
      throw new BadRequestError('Description must be a string');
    }

    if (description && description.length > 1000) {
      throw new BadRequestError('Description must be at most 1000 characters');
    }

    if (category && typeof category !== 'string') {
      throw new BadRequestError('Category must be a string');
    }

    if (category && category.length > 50) {
      throw new BadRequestError('Category must be at most 50 characters');
    }

    const taskData: CreateTaskDto = {
      title: title.trim(),
      description: description?.trim(),
      dueDate,
      category: category?.trim(),
    };

    const task = await db.createTask(taskData);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tasks/:id - Get a task by ID
tasksRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const task = await db.getTaskById(id);

    if (!task) {
      throw new NotFoundError(`Task with id ${id} not found`);
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/tasks/:id - Update a task
tasksRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, category } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      throw new BadRequestError('Title must be a non-empty string');
    }

    if (title && title.length > 200) {
      throw new BadRequestError('Title must be at most 200 characters');
    }

    if (description !== undefined && typeof description !== 'string') {
      throw new BadRequestError('Description must be a string');
    }

    if (description && description.length > 1000) {
      throw new BadRequestError('Description must be at most 1000 characters');
    }

    if (status !== undefined && !['open', 'completed'].includes(status)) {
      throw new BadRequestError('Status must be either "open" or "completed"');
    }

    if (category !== undefined && typeof category !== 'string') {
      throw new BadRequestError('Category must be a string');
    }

    if (category && category.length > 50) {
      throw new BadRequestError('Category must be at most 50 characters');
    }

    const updateData: UpdateTaskDto = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (category !== undefined) updateData.category = category.trim();

    try {
      const task = await db.updateTask(id, updateData);
      res.json(task);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundError(`Task with id ${id} not found`);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/tasks/:id - Delete a task
tasksRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    try {
      await db.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundError(`Task with id ${id} not found`);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/tasks/:id/toggle - Toggle task completion status
tasksRouter.patch('/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    try {
      const task = await db.toggleTask(id);
      res.json(task);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundError(`Task with id ${id} not found`);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});
