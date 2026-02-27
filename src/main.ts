import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { loggerConfig } from './services/logger/logger.config';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  const appConfigService = app.get(AppConfigService);
  // Sử dụng AppLoggerService làm logger mặc định cho NestJS
  app.useLogger(logger);

  const port = appConfigService.port;
  await app.listen(port);

  logger.log(
    `Application is running on: http://localhost:${String(port)}`,
    'Bootstrap',
  );
}
void bootstrap();
