import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Siz tizimga kirmagansiz (Token topilmadi)');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'SECRET_KEY_123', // AuthModule dagi secret bilan bir xil bo'lsin
      });

      // --- ENG MUHIM QISMI: ---
      // Controllerdagi req.user aynan shu yerdan to'ladi
      request['user'] = {
        userId: payload.sub,
        username: payload.username,
        role: payload.role,
      };

    } catch (error) {
      const message = error.name === 'TokenExpiredError' 
        ? 'Token muddati o‘tgan' 
        : 'Token yaroqsiz';
      throw new UnauthorizedException(message);
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}