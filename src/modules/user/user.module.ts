import { Module } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
