import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class RegisterService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: RegisterDto) {
    const { email, password, name } = dto;

    // 1. Kiểm tra user đã tồn tại chưa
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // 2. Hash mật khẩu
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo user mới
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: 'USER',
    });

    return {
      message: 'Đăng ký tài khoản thành công',
      data: user,
    };
  }
}
