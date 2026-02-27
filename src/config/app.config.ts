import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { IAppConfig } from './app-config.type';
import { registerAs } from '@nestjs/config';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}
class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsString()
  @IsOptional()
  DATABASE_URL: string;

  @IsNumber()
  @IsOptional()
  PORT: number;

  @IsString()
  @IsOptional()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN: string;

  @IsString()
  @IsOptional()
  EMAIL_HOST: string;

  @IsNumber()
  @IsOptional()
  EMAIL_PORT: number;

  @IsString()
  @IsOptional()
  EMAIL_USER: string;

  @IsString()
  @IsOptional()
  EMAIL_PASSWORD: string;

  @IsString()
  @IsOptional()
  EMAIL_FROM: string;
}

export default registerAs<IAppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || '',
    port: Number(process.env.PORT) || 3000,
    jwtSecret: process.env.JWT_SECRET || 'secretKey',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    emailHost: process.env.EMAIL_HOST || '',
    emailPort: Number(process.env.EMAIL_PORT) || 587,
    emailUser: process.env.EMAIL_USER || '',
    emailPassword: process.env.EMAIL_PASSWORD || '',
    emailFrom: process.env.EMAIL_FROM || '',
  };
});
