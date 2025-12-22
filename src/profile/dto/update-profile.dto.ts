import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Eshmat Toshmatov', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '+998901234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Uzbekistan', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Profil rasmi', required: false })
  avatar?: any; // Bu Swagger-da "Choose File" tugmasini chiqaradi
}