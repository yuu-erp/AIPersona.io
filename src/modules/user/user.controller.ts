import {
  Controller,
  Get,
  Query,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { Roles, AuthUserRequest } from 'src/decorators';
import { UserResponseDto } from './dto/user-response.dto';
import type { User } from 'src/generated/prisma/client';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN', 'USER')
  @Get('me')
  getMe(@AuthUserRequest() user: User): UserResponseDto {
    return new UserResponseDto(user);
  }

  @Roles('ADMIN')
  @Get()
  async findAll(@Query() query: FindAllUserDto) {
    return this.userService.findAll({
      page: query.page,
      limit: query.limit,
    });
  }

  @Roles('ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
