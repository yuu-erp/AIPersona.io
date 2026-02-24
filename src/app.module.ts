import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedConfigModule } from './config/shared-config.module';
import { PrismaModule } from './service/prisma/prisma.module';

@Module({
  imports: [SharedConfigModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
