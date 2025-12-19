import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException 
} from '@nestjs/common';
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

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 2. Agar foydalanuvchi avtorizatsiyadan o'tmagan bo'lsa
    if (!user) {
      throw new ForbiddenException("Tizimga kirmagansiz. Iltimos, avval login qiling.");
    }

    // 3. SUPERADMIN har doim hamma joydan o'tadi
    if (user.role === 'SUPERADMIN') {
      return true;
    }

    // 4. Rolni tekshirish
    const hasRole = requiredRoles.some((role) => 
      user.role?.toUpperCase() === role.toUpperCase()
    );

    if (!hasRole) {
      // SHU YERDA TUSHUNARLI XABAR QAYTARAMIZ
      throw new ForbiddenException(
        `Kirish taqiqlangan! Ushbu bo'lim faqat [${requiredRoles.join(', ')}] huquqiga ega foydalanuvchilar uchun. Sizning rolingiz: ${user.role}`
      );
    }

    return true;
  }
}