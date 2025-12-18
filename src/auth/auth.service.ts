import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Bu yerga email ni qo'shishimiz shart, chunki UsersService uni kutyapti
  async signUp(username: string, email: string, pass: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltOrRounds);
    
    // ENDI TARTIB BO'YICHA: username, email, hashedPassword
    return this.usersService.create(username, email, hashedPassword);
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi!');
    }

    // passwordHash bazadagi nom bilan to'g'ri yozilgan
    const isMatch = await bcrypt.compare(pass, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Parol xato!');
    }

    const payload = { sub: user.id, username: user.username , role: user.role};
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async getAllUsers() {
    return this.usersService.findAll();
  }

  
}