import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../services/logger/logger.service';

// 1. Định nghĩa interface cho cấu trúc Error của NestJS
interface NestHttpExceptionResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext(GlobalExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const correlationId =
      (request.headers['correlation-id'] as string) || 'N/A';

    // 2. Trích xuất thông báo lỗi an toàn
    const errorMessage =
      exception instanceof Error ? exception.message : 'Unknown error';
    const errorStack = exception instanceof Error ? exception.stack : '';

    this.logger.error(
      `${request.method} ${request.url} - Error: ${errorMessage}`,
      errorStack,
    );

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message: string | string[] = 'Something went wrong!';

    // 3. Kiểm tra kiểu dữ liệu một cách nghiêm ngặt
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (this.isNestHttpExceptionResponse(res)) {
        // Trường hợp lỗi chuẩn từ ValidationPipe hoặc built-in exceptions
        message = res.message;
        errorCode = res.error.toUpperCase().replace(/\s+/g, '_');
      } else if (typeof res === 'string') {
        // Trường hợp throw new HttpException('Lỗi rồi', 400)
        message = res;
        errorCode = HttpStatus[status] || 'UNKNOWN_ERROR';
      }
    }

    response.status(status).json({
      correlationId,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorCode,
      message,
    });
  }

  // 4. Type Guard để kiểm tra cấu trúc object mà không dùng any
  private isNestHttpExceptionResponse(
    res: unknown,
  ): res is NestHttpExceptionResponse {
    return (
      typeof res === 'object' &&
      res !== null &&
      'message' in res &&
      'error' in res
    );
  }
}
