import { Exclude, Expose } from 'class-transformer';
import { UserRole, PlanType } from 'src/generated/prisma/client';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password?: string | null;

  @Expose()
  fullName?: string | null;

  @Expose()
  avatarUrl?: string | null;

  @Expose()
  role: UserRole;

  @Expose()
  isEmailVerified: boolean;

  @Expose()
  plan: PlanType;

  @Expose()
  planExpiresAt?: Date | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
