import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public errorType: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, 'NotFound', message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, 'BadRequest', message, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(500, 'InternalServerError', message);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    const response: { error: string; message: string; details?: unknown } = {
      error: err.errorType,
      message: err.message,
    };

    if (err.details) {
      response.details = err.details;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Unknown error
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
};
