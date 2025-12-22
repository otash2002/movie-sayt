import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: any, userId: string) {
    const { categoryIds = [], ...movieData } = createMovieDto;
    const slug = `${movieData.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-${Date.now()}`;

    const finalCategoryIds: string[] = Array.isArray(categoryIds) ? categoryIds : (categoryIds ? [categoryIds] : []);

    return this.prisma.movie.create({
      data: {
        ...movieData,
        releaseYear: Number(movieData.releaseYear),
        durationMinutes: Number(movieData.durationMinutes),
        slug,
        createdBy: { connect: { id: userId } },
        categories: { create: finalCategoryIds.map(id => ({ categoryId: id })) }
      },
      include: { categories: { include: { category: true } } }
    });
  }

  async findAll(query: any) {
    const { search, year, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (year) where.releaseYear = Number(year);

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where, skip, take: Number(limit),
        include: { categories: { include: { category: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.movie.count({ where })
    ]);

    return { data: movies, meta: { total, page: Number(page), lastPage: Math.ceil(total / Number(limit)) } };
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: { categories: { include: { category: true } } }
    });
    if (!movie) throw new NotFoundException('Kino topilmadi');
    return movie;
  }

  async update(id: string, updateDto: any) {
    const movie = await this.findOne(id);
    const { categoryIds, ...movieData } = updateDto;

    if (updateDto.posterUrl && movie.posterUrl) {
      this.deletePhysicalFile(movie.posterUrl);
    }

    const updateData: any = { ...movieData };
    if (movieData.releaseYear) updateData.releaseYear = Number(movieData.releaseYear);
    if (movieData.durationMinutes) updateData.durationMinutes = Number(movieData.durationMinutes);

    if (categoryIds) {
      const finalIds: string[] = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
      updateData.categories = {
        deleteMany: {},
        create: finalIds.map(catId => ({ categoryId: catId }))
      };
    }

    return this.prisma.movie.update({
      where: { id },
      data: updateData,
      include: { categories: { include: { category: true } } }
    });
  }

  async remove(id: string) {
    const movie = await this.findOne(id);
    await this.prisma.movieCategory.deleteMany({ where: { movieId: id } });
    if (movie.posterUrl) this.deletePhysicalFile(movie.posterUrl);
    return this.prisma.movie.delete({ where: { id } });
  }

  private deletePhysicalFile(relativePaths: string) {
    try {
      const fullPath = join(process.cwd(), relativePaths);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch (err) {
      console.error('Fayl o‘chirishda xato:', err);
    }
  }
}