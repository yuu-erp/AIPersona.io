import { Injectable } from '@nestjs/common';
import { Prisma, User, UserRole } from 'src/generated/prisma/client';
import { PrismaService } from 'src/services/prisma';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: { isEmailVerified?: boolean; role?: UserRole };
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data: {
        isEmailVerified: data.isEmailVerified,
        role: data.role,
      },
      where,
    });
  }
}
