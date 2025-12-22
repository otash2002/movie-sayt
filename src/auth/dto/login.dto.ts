import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin_user', description: 'Foydalanuvchi nomi' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Maxfiy parol' })
  @IsString()
  @IsNotEmpty()
  password: string;
}