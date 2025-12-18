import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express'; // Bu oddiy Express tipi uchun

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // NOMINI O'ZGARTIRDIK: activate -> canActivate
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token topilmadi!');
    }

  try {
  const payload = await this.jwtService.verifyAsync(token, {
    secret: 'SECRET_KEY_123', // buni o'zingizniki bilan almashtiring
  });

  // MUHIM QATOR: RolesGuard aynan mana shu 'user'ni qidiradi
  request.user = {
    userId: payload.sub,
    username: payload.username,
    role: payload.role, // Tokendan kelayotgan rolni requestga qo'shdik
  };
  
} catch {
  throw new UnauthorizedException();
}
return true;
  }
private extractTokenFromHeader(request: any): string | undefined {
  // 1. Header'ni har xil yo'l bilan qidiramiz (katta-kichik harfga qarab)
  const auth = request.headers.authorization || request.headers['authorization'];
  
  // Terminalda ko'rish uchun (BU MUHIM!)
  console.log('--- TEST: Header nima keldi? ---', auth);

  if (!auth) return undefined;

  const [type, token] = auth.split(' ');
  return type === 'Bearer' ? token : undefined;
}
}