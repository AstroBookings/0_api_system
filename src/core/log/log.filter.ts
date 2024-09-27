import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

type HttpContext = {
  request: Request;
  response: Response;
};

type source = {
  method: string;
  originalUrl: string;
};

/**
 * Filter that catches all exceptions thrown in the application.
 * @description It logs and sends a formatted response to the client.
 */
@Catch(HttpException)
export class LogFilter implements ExceptionFilter {
  #logger: Logger = new Logger(LogFilter.name);

  /**
   * Catches the exception and processes it.
   * @param exception - The exception to catch.
   * @param host - The host to catch the exception.
   */
  catch(exception: any, host: ArgumentsHost): void {
    this.#logger.debug(`exception: ${exception.message}, ${exception.stack}`, LogFilter.name);
    const ctx: HttpContext = this.#getHttpContext(host);
    const status: number = this.#getStatus(exception);
    const errorMessage = this.#getErrorMessage(exception);
    this.#logError(ctx.request, status, errorMessage);
    this.#sendResponse(ctx.response, status, errorMessage);
  }

  #getHttpContext(host: ArgumentsHost): HttpContext {
    const ctx = host.switchToHttp();
    return {
      request: ctx.getRequest<Request>(),
      response: ctx.getResponse<Response>(),
    };
  }

  #getStatus(exception: any): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  #getErrorMessage(exception: any): string {
    return exception['response']?.message || exception.message || 'Internal server error';
  }

  #logError(request: Request, status: number, message: string): void {
    const { method, originalUrl }: source = request;
    const logMessage = `${method} ${originalUrl} ${message}`;
    if (status >= 500) {
      this.#logger.error(logMessage, LogFilter.name);
    } else {
      this.#logger.warn(logMessage, LogFilter.name);
    }
  }

  #sendResponse(response: Response, statusCode: number, message: string): void {
    const timestamp = new Date().toISOString();
    const body = { statusCode, message, timestamp };
    response.status(statusCode).json(body);
  }
}
