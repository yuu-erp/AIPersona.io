import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/decorators/allow-anonymous.decorator';
import { RegisterDto } from './register/dto/register.dto';
import { RegisterService } from './register/register.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerService: RegisterService) {}

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.registerService.execute(body);
  }
}
