import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import redisConfig from './redis.config';
import aiConfig from './ai.config';
import socialConfig from './social.config';
import authConfig from './auth.config';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        aiConfig,
        socialConfig,
        authConfig,
      ],
      validate,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
  ],
})
export class SharedConfigModule {}
