import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailVerifyService } from './services/mail';
import { Public } from './decorators';

@Public()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailVerifyService: EmailVerifyService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  getUsers() {
    return this.appService.getUsers();
  }

  @Get('test-email')
  async testEmail(@Query('email') email: string) {
    const targetEmail = email || 'hoan.lekhaihoan@gmail.com';
    await this.emailVerifyService.sendEmail(targetEmail, {
      verifyEmailUrl: 'http://localhost:8080/verify?token=test-token-123',
    });
    return {
      message: `Test email sent to ${targetEmail}`,
      status: 'success',
    };
  }
}
