import { IsEnum, IsOptional, IsString } from 'class-validator';
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
}

export default registerAs<IAppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || '',
  };
});
