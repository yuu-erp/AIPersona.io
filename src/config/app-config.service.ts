import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './app-config.type';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<{ app: IAppConfig }>) {}
  get nodeEnv(): string {
    return this.configService.getOrThrow('app.nodeEnv', { infer: true });
  }

  get databaseUrl(): string {
    return this.configService.getOrThrow('app.databaseUrl', { infer: true });
  }

  get port(): number {
    return this.configService.getOrThrow('app.port', { infer: true });
  }

  get jwtSecret(): string {
    return this.configService.getOrThrow('app.jwtSecret', { infer: true });
  }

  get jwtExpiresIn(): string {
    return this.configService.getOrThrow('app.jwtExpiresIn', { infer: true });
  }

  get jwtRefreshSecret(): string {
    return this.configService.getOrThrow('app.jwtRefreshSecret', {
      infer: true,
    });
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.getOrThrow('app.jwtRefreshExpiresIn', {
      infer: true,
    });
  }

  get emailHost(): string {
    return this.configService.getOrThrow('app.emailHost', { infer: true });
  }

  get emailPort(): number {
    return this.configService.getOrThrow('app.emailPort', { infer: true });
  }

  get emailUser(): string {
    return this.configService.getOrThrow('app.emailUser', { infer: true });
  }

  get emailPassword(): string {
    return this.configService.getOrThrow('app.emailPassword', { infer: true });
  }

  get emailFrom(): string {
    return this.configService.getOrThrow('app.emailFrom', { infer: true });
  }
}
