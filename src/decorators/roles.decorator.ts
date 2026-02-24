import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../generated/prisma/enums';
import { DECORATOR } from './decorator.enum';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(DECORATOR.ROLES, roles);
