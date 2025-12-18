import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Dekoratordan kerakli rollarni olamiz
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Agar rol talab qilinmasa, ruxsat beramiz
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 2. Agar foydalanuvchi topilmasa yoki roli bo'lmasa - bloklaymiz
    if (!user || !user.role) {
      return false;
    }

    // 3. SUPERADMIN har doim hamma joydan o'tadi
    if (user.role === 'SUPERADMIN') {
      return true;
    }

    // 4. Solishtirish (Katta-kichik harfga e'tibor berib)
    return requiredRoles.some((role) => 
      user.role.toUpperCase() === role.toUpperCase()
    );
  }
}