import * as Sentry from '@sentry/node';
import { Response } from 'express';

export abstract class BaseController {
  
  protected handleSuccess(res: Response, data: any, statusCode: number = 200, message?: string): void {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  protected handleError(error: any, res: Response, context: string): void {
    Sentry.captureException(error, { extra: { context } });
    
    console.error(`[${context}] Error:`, error);
    
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : error.message;

    res.status(statusCode).json({
      success: false,
      error: message
    });
  }
}
