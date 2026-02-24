import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { SharedConfigModule } from 'src/config';
import { GlobalExceptionFilter } from 'src/exceptions';
import { JwtAuthGuard } from 'src/guards';
import { UserModule } from 'src/modules/user/user.module';
import { CustomValidationPipe } from 'src/pipes';
import { LoggerModule } from 'src/services/logger';
import { PrismaModule } from 'src/services/prisma';
import { EmailModule } from 'src/services/mail';

@Module({
  imports: [
    SharedConfigModule,
    PrismaModule,
    LoggerModule,
    UserModule,
    EmailModule,
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
