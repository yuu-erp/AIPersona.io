import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { SharedConfigModule } from 'src/config';
import { GlobalExceptionFilter } from 'src/exceptions';
import { CustomValidationPipe } from 'src/pipes';
import { LoggerModule } from 'src/services/logger';
import { PrismaModule } from 'src/services/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    SharedConfigModule,
    PrismaModule,
    LoggerModule,
    AuthModule,
    UserModule,
  ],
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
