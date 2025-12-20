import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Inception' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'A mind-bending thriller', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2010 })
  @IsNotEmpty()
  @IsNumber()
  releaseYear: number;

  @ApiProperty({ example: 148, description: 'Davomiyligi (daqiqa)' })
  @IsNotEmpty()
  @IsNumber()
  durationMinutes: number; 

  @ApiProperty({ example: 'https://image.com/poster.jpg', required: false })
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiProperty({ 
    example: ['uuid-category-id'], 
    description: 'Kategoriya ID lari roʻyxati' 
  })
  @IsArray()
  categoryIds: string[];
}