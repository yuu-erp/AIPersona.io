import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User, Prisma } from 'src/generated/prisma/client'; // Sử dụng Prisma.UserUpdateInput để linh hoạt
import { AppLoggerService } from 'src/services/logger/logger.service';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: AppLoggerService,
  ) {}

  // 1. Tìm người dùng theo Email
  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  // 2. Tìm người dùng theo ID (Khóa chính)
  async findById(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  // 3. Tạo người dùng mới
  // Lưu ý: Thay 'any' bằng CreateUserDto của bạn
  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prismaService.user.create({ data });
    } catch (error) {
      this.logger.error('Lỗi khi tạo người dùng', (error as Error).stack);
      throw new InternalServerErrorException('Không thể tạo người dùng');
    }
  }

  // 4. Cập nhật thông tin người dùng
  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(
        `Lỗi khi cập nhật người dùng ID: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Cập nhật thất bại');
    }
  }

  // 5. Xóa người dùng
  async delete(id: number): Promise<User> {
    try {
      return await this.prismaService.user.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `Lỗi khi xóa người dùng ID: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Xóa người dùng thất bại');
    }
  }
}
