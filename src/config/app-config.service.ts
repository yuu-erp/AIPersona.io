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
}
