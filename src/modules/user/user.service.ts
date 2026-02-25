import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { UserResponseDto } from './dto/user-response.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(params: {
    page?: number;
    limit?: number;
  }): Promise<{ users: UserResponseDto[]; total: number }> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const { users, total } = await this.userRepository.findAll({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      users: users.map((user) => new UserResponseDto(user)),
      total,
    };
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return new UserResponseDto(user);
  }
}
