import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    try {
      if (exception instanceof HttpException) {
        const responseBody = exception.getResponse();

        if (typeof responseBody === 'object' && responseBody !== null) {
          const { message, errors } = responseBody as {
            message?: string;
            errors?: any[];
          };

          response.status(exception.getStatus()).json({
            status: exception.getStatus(),
            message: message || 'An error occurred',
            errors: errors || [],
          });
        } else {
          response.status(exception.getStatus()).json({
            status: exception.getStatus(),
            message: responseBody || 'An error occurred',
            errors: [],
          });
        }
      } else if (exception instanceof ZodError) {
        response.status(400).json({
          status: 400,
          message: 'Validation error',
          errors: exception.issues.map((err) => ({
            [err.path.join('.')]: err.message,
          })),
        });
      } else {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          errors: [exception.message],
        });
      }
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'An unexpected error occurred.',
        errors: [error.message],
      });
    }
  }
}
