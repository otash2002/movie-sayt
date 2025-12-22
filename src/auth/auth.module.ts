import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // QO'SHILDI
import { JwtStrategy } from './jwt.strategy';       // QO'SHILDI (faylingiz bor deb hisoblaymiz)

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // QO'SHILDI
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY_123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy], // JwtStrategy-ni tanitish
  controllers: [AuthController],
  exports: [AuthService, PassportModule], // PassportModule-ni export qilish shart!
})
export class AuthModule {}