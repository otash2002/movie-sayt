import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Prisma ulanishi
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {} // Prisma-ni inject qilish

  // 1. Yangi kino yaratish metodi
  async create(dto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        releaseYear: dto.releaseYear,
        durationMinutes: dto.durationMinutes,
        subscriptionType: dto.subscriptionType,
        createdById: dto.createdById, // Admin ID-si
      },
    });
  }

  // 2. Hammasini olish metodi
  async findAll() {
    return this.prisma.movie.findMany();
  }
}