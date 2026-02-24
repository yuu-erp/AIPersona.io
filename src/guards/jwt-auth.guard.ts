import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AppLoggerService } from '../services/logger/logger.service';
import { Request } from 'express';
import { DECORATOR } from 'src/decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly logger: AppLoggerService,
  ) {
    super();
    this.logger.setContext('JwtAuthGuard');
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      DECORATOR.IS_PUBLIC,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      const request = context.switchToHttp().getRequest<Request>();
      const { method, url } = request;
      this.logger.warn(`Unauthorized access to ${method} ${url}`);
      throw err instanceof Error ? err : new UnauthorizedException();
    }
    return user;
  }
}
