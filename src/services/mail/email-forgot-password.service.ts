import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { join } from 'path';
import { DELAY_RETRY_EMAIL, RETRIES_EMAIL_NUMBER } from 'src/helpers/constant';
import { AppLoggerService } from '../logger';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailForgotPasswordService extends EmailService {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly logger: AppLoggerService,
  ) {
    super(configService, logger);
    this.DELAY_RETRY_EMAIL = DELAY_RETRY_EMAIL;
    this.RETRIES_EMAIL_NUMBER = RETRIES_EMAIL_NUMBER;
    this.emailInfo = {
      template: join(process.cwd(), 'public/emailTemplate/resetPassword.html'),
      subject: 'SPS RESET YOUR PASSWORD',
    };
  }
}
