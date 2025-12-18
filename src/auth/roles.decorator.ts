import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Mana shu qator eksport qilingan bo'lishi shart!
export const ROLES_KEY = 'roles'; 

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);