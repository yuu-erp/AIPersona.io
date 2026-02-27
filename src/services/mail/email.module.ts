import { Global, Module } from '@nestjs/common';

import { EmailService } from './email.service';
import { EmailVerifyService } from './email-verify.service';
import { EmailForgotPasswordService } from './email-forgot-password.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [EmailService, EmailForgotPasswordService, EmailVerifyService],
  exports: [EmailService, EmailForgotPasswordService, EmailVerifyService],
})
export class EmailModule {}
