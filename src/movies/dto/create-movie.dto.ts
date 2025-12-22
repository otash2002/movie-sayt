import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Inception' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A mind-bending thriller', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2010 })
  @IsNumber()
  @IsNotEmpty()
  releaseYear: number;

  @ApiProperty({ example: 148 })
  @IsNumber()
  @IsNotEmpty()
  durationMinutes: number;

  // 1. Swagger uchun rasm tanlash tugmasi
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  poster?: any;

  // 2. Bazaga saqlash uchun yo'l (Swaggerda ko'rinmaydi)
  @ApiHideProperty() 
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiProperty({ example: ['uuid-category-id'] })
  @IsArray()
  categoryIds: string[];
}