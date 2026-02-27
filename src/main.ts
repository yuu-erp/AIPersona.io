import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLoggerService } from './services/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sử dụng AppLoggerService làm logger mặc định cho NestJS
  const logger = await app.resolve(AppLoggerService);
  app.useLogger(logger);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(
    `Application is running on: http://localhost:${String(port)}`,
    'Bootstrap',
  );
}
void bootstrap();
