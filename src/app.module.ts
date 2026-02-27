import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './services/prisma/prisma.module';
import { AppConfigModule } from './config/app-config.module';
import { LoggerModule } from './services/logger/logger.module';

@Module({
  imports: [AppConfigModule, LoggerModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
