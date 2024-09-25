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
 * Filter that catches and logs all exceptions thrown in the application.
 * @description It also sends a formatted response to the client.
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
    this.#logger.debug(`catch ${exception.message}, ${exception.stack}`, LogFilter.name);
    const ctx: HttpContext = this.#getHttpContext(host);
    const status: number = this.#getStatus(exception);
    this.#logError(exception, ctx.request, status);
    this.#sendResponse(ctx.response, status, exception);
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

  #logError(exception: any, request: Request, status: number): void {
    const { method, originalUrl }: source = request;
    const error: string = exception.message;
    if (status >= 500) {
      this.#logger.error(`${method} ${originalUrl} ${error}`, LogFilter.name);
    } else {
      this.#logger.warn(`${method} ${originalUrl} ${error}`, LogFilter.name);
    }
  }

  #sendResponse(response: Response, status: number, exception: any): void {
    const body = {
      statusCode: status,
      message: exception['response']?.message || exception.message || 'Internal server error',
      timestamp: new Date().toISOString(),
    };
    response.status(status).json(body);
  }
}
