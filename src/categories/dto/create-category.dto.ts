import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Fantastika', description: 'Janrning nomi' })
  name: string;

  @ApiProperty({ example: 'fantastika', description: 'Janrning URL uchun qisqa nomi' })
  slug: string;

  @ApiProperty({ example: 'Kosmos va kelajak haqidagi kinolar', required: false })
  description?: string;
}