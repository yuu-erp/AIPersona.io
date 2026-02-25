import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { AppLoggerService } from '../logger';
import { readFile } from 'fs/promises';
import { compile } from 'handlebars';
import Mail from 'nodemailer/lib/mailer';
import retry from 'async-retry';

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

    await retry(
      async () => {
        await this.client.sendMail(emailOptions);
        this.logger.log(`Email sent to ${email}`);
      },
      {
        retries: this.RETRIES_EMAIL_NUMBER,
        minTimeout: this.DELAY_RETRY_EMAIL,
        onRetry: (error, attempt) => {
          this.logger.warn(
            `Failed to send email to ${email}. Retrying... (Attempt ${attempt}/${this.RETRIES_EMAIL_NUMBER})`,
          );
        },
      },
    ).catch((error) => {
      this.logger.error(
        `Failed to send email to ${email} after ${this.RETRIES_EMAIL_NUMBER} retries`,
        error instanceof Error ? error.stack : undefined,
      );
    });
  }

  private async readEmailTemplate(): Promise<string> {
    return await readFile(this.emailInfo.template, { encoding: 'utf-8' });
  }
}
