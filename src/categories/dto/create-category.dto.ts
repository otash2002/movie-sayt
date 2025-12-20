import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ 
    example: 'Fantastika', 
    description: 'Janrning nomi' 
  })
  @IsNotEmpty({ message: 'Janr nomi boʻsh boʻlmasligi kerak' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ 
    example: 'Kosmos va kelajak haqida', 
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;
}