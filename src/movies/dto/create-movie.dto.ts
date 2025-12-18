import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'Qashqirlar makoni' })
  title: string;

  @ApiProperty({ example: 'qashqirlar-makoni' })
  slug: string;

  @ApiProperty({ example: 'Zoʻr kino haqida qisqacha...', required: false })
  description?: string;

  @ApiProperty({ example: 2024 })
  releaseYear: number;

  @ApiProperty({ example: 120 })
  durationMinutes: number;

  @ApiProperty({ example: 'premium' })
  subscriptionType: string;

  @ApiProperty({ example: 'biron-bir-user-uuid-shuyerga' })
  createdById: string; 
}