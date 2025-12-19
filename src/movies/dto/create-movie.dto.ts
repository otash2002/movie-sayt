import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Inception' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'inception-2010' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'A mind-bending thriller', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2010 })
  @IsNumber()
  releaseYear: number;

  @ApiProperty({ example: 148 })
  @IsNumber()
  durationMinutes: number;

  @ApiProperty({ example: 'https://image.com/poster.jpg' })
  @IsString()
  posterUrl: string;

  @ApiProperty({ example: 'free', enum: ['free', 'premium'] })
  @IsString()
  subscriptionType: string;

  // MUHIM QISM: Foydalanuvchi ID-si
  @ApiProperty({ example: '6cce4a36-cf6b-424b-a6f6-bf94d2e76815' })
  @IsUUID()
  createdById: string;

  // MUHIM QISM: Janrlar ID-lari massivi
  @ApiProperty({ 
    type: [String], 
    example: ['42cefa44-b183-40f7-bc31-7d47072334cc'],
    description: 'Kategoriyalar UUID massivi'
  })
  @IsArray()
  categoryIds: string[];
}