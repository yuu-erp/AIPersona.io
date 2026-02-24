import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import aiConfig from './ai.config';
import appConfig from './app.config';
import authConfig from './auth.config';
import databaseConfig from './database.config';
import emailConfig from './email.config';
import { validate } from './env.validation';
import redisConfig from './redis.config';
import socialConfig from './social.config';

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
        emailConfig,
      ],
      validate,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
  ],
})
export class SharedConfigModule {}
