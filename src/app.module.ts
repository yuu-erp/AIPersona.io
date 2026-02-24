import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { SharedConfigModule } from './config';
import { GlobalExceptionFilter } from './exceptions';
import { JwtAuthGuard } from './guards';
import { UserModule } from './modules/user/user.module';
import { CustomValidationPipe } from './pipes';
import { LoggerModule } from './services/logger';
import { PrismaModule } from './services/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [SharedConfigModule, PrismaModule, LoggerModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    { provide: APP_PIPE, useClass: CustomValidationPipe },
  ],
})
export class AppModule {}
