import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { retry } from 'src/helpers/retry';
import { AppLoggerService } from '../logger';
import { readFile } from 'fs/promises';
import { compile } from 'handlebars';
import Mail from 'nodemailer/lib/mailer';

export interface EmailInfo {
  template: string;
  subject: string;
}
export type ForgotPasswordParam = Record<'resetPasswordUrl', string>;
export type VerifyEmailParam = Record<'verifyEmailUrl', string>;
export type EmailParam = ForgotPasswordParam | VerifyEmailParam;

@Injectable()
export class EmailService {
  protected client: Transporter;
  protected RETRIES_EMAIL_NUMBER!: number;
  protected DELAY_RETRY_EMAIL!: number;
  protected emailInfo!: EmailInfo;
  constructor(
    protected readonly configService: ConfigService,
    protected readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(EmailService.name);
    this.client = createTransport({
      host: configService.get<string>('email.host'),
      secure: false,
      port: configService.get<number>('email.port'),
      auth: {
        user: configService.get<string>('email.username'),
        pass: configService.get<string>('email.password'),
      },
    });
  }

  async sendEmail(email: string, param: EmailParam): Promise<void> {
    const template = await this.readEmailTemplate();

    const html = compile(template);

    const emailOptions: Mail.Options = {
      from: this.configService.get<string>('email.from'),
      to: email,
      subject: this.emailInfo.subject,
      html: html(param),
    };
    try {
      await this.client.sendMail(emailOptions);
      this.logger.log(`Email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${email}`,
        error instanceof Error ? error.stack : undefined,
      );
      await retry(
        () => this.client.sendMail(emailOptions),
        this.RETRIES_EMAIL_NUMBER,
        this.DELAY_RETRY_EMAIL,
        this.logger,
      );
    }
  }

  private async readEmailTemplate(): Promise<string> {
    return await readFile(this.emailInfo.template, { encoding: 'utf-8' });
  }
}
