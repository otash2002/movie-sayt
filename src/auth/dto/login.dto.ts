import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin_user' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}