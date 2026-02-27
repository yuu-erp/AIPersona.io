import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterService } from './register/register.service';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [RegisterService, UserRepository],
  exports: [RegisterService],
})
export class AuthModule {}
