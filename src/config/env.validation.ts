import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
  ValidationError,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Staging = 'staging',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  PORT: number = 8080;

  @IsUrl({ protocols: ['postgres', 'postgresql'], require_tld: false })
  DATABASE_URL!: string;

  @IsString()
  REDIS_HOST!: string;

  @IsNumber()
  REDIS_PORT: number = 6379;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  @IsUrl({ require_tld: false })
  AI_ENGINE_URL!: string;

  @IsString()
  AI_API_KEY!: string;

  @IsString()
  S3_STORAGE_BUCKET!: string;

  @IsString()
  S3_STORAGE_REGION!: string;

  @IsString()
  TIKTOK_CLIENT_ID!: string;

  @IsString()
  TIKTOK_CLIENT_SECRET!: string;

  @IsString()
  FB_CLIENT_ID!: string;

  @IsString()
  FB_CLIENT_SECRET!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  JWT_EXPIRES_IN: string = '7d';
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors: ValidationError[] = validateSync(validatedConfig as object, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig as EnvironmentVariables;
}
