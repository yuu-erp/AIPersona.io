import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { AppConfigService } from 'src/config/app-config.service';
import { DELAY_RETRY_EMAIL, RETRIES_EMAIL_NUMBER } from 'src/helpers/constant';
import { AppLoggerService } from '../logger/logger.service';
import { EmailService } from './email.service';

@Injectable()
export class EmailForgotPasswordService extends EmailService {
  constructor(
    protected readonly appConfigService: AppConfigService,
    protected readonly logger: AppLoggerService,
  ) {
    super(appConfigService, logger);
    this.DELAY_RETRY_EMAIL = DELAY_RETRY_EMAIL;
    this.RETRIES_EMAIL_NUMBER = RETRIES_EMAIL_NUMBER;
    this.emailInfo = {
      template: join(process.cwd(), 'public/emailTemplate/resetPassword.html'),
      subject: 'SPS RESET YOUR PASSWORD',
    };
  }
}
