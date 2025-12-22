import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'admin_user', description: 'Foydalanuvchi nomi' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin@kino.uz', description: 'Elektron pochta' })
  @IsEmail({}, { message: "Noto'g'ri email formati" })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Maxfiy parol' })
  @IsString()
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  password: string;
}