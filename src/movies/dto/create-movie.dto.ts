import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer'; // Buni qo'shing

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
  @Transform(({ value }) => Number(value)) // String kelgan 2010 ni raqamga aylantiradi
  @IsNumber()
  @IsNotEmpty()
  releaseYear: number;

  @ApiProperty({ example: 148 })
  @Transform(({ value }) => Number(value)) // String kelgan 148 ni raqamga aylantiradi
  @IsNumber()
  @IsNotEmpty()
  durationMinutes: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  poster?: any;

  @ApiHideProperty() 
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiProperty({ example: ['uuid-category-id'] })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Bitta string kelsa ham [string] qiladi
  @IsArray()
  categoryIds: string[];
}