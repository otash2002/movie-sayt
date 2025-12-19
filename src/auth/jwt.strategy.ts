// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Headerdan Bearer'ni o'zi qidiradi
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY_123', // AuthModule bilan bir xil!
    });
  }

  async validate(payload: any) {
    // Tokendan olingan ma'lumotni 'request.user'ga aynan shu metod joylaydi
    if (!payload) {
      throw new UnauthorizedException();
    }
    return { 
      userId: payload.sub, 
      username: payload.username, 
      role: payload.role 
    };
  }
}