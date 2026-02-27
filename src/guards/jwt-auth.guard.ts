import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { firstValueFrom, Observable } from 'rxjs';
import { DECORATOR } from 'src/decorators/decorator.enum';
import { AppLoggerService } from '../services/logger/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: AppLoggerService,
  ) {
    super();
    this.logger.setContext(JwtAuthGuard.name);
  }

  // Chuyển đổi canActivate thành async để xử lý đồng nhất các kiểu dữ liệu trả về
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      DECORATOR.IS_PUBLIC,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const result = super.canActivate(context);

    // Xử lý trường hợp result là Observable hoặc Promise từ Passport
    if (result instanceof Observable) {
      return await firstValueFrom(result);
    }

    return result;
  }

  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser | null, // Explicitly check for null
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      const request = context.switchToHttp().getRequest<Request>();
      const { method, url } = request;

      // Log thông tin chi tiết về lý do thất bại (ví dụ: Token expired, Invalid token)
      const reason = info instanceof Error ? info.message : 'No token provided';
      this.logger.warn(
        `Unauthorized access: [${method}] ${url} - Reason: ${reason}`,
      );

      if (err instanceof Error) {
        throw err;
      }
      throw new UnauthorizedException(
        'Phiên đăng nhập không hợp lệ hoặc đã hết hạn',
      );
    }

    return user;
  }
}
