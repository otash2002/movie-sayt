import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ data: dto });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Xato: '${dto.slug}' slugi band!`);
      }
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' } // Alfavit bo'yicha tartiblash
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Yangilash uchun janr topilmadi');
      }
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.category.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Oʻchirish uchun janr topilmadi');
      }
      throw new BadRequestException(error.message);
    }
  }
}