import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'admin_user', description: 'Foydalanuvchi nomi' })
  username: string;

  @ApiProperty({ example: 'admin@kino.uz', description: 'Elektron pochta' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Maxfiy parol' })
  password: string;
}