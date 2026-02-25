import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
): T {
  const validatedConfig = plainToInstance(envVariablesClass, config, {
    enableImplicitConversion: true,
  }) as T;

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    const errorMessages = (errors as ValidationError[])
      .map((error) => {
        const constraints = error.constraints as
          | Record<string, string>
          | undefined;
        if (!constraints) return '';
        return Object.values(constraints).join(', ');
      })
      .filter(Boolean)
      .join('; ');
    throw new Error(`Config validation error: ${errorMessages}`);
  }

  return validatedConfig;
}

export default validateConfig;
