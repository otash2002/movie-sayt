import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  // 1. Yangi kino yaratish

  async create(createMovieDto: CreateMovieDto, userId: string) {
  // Avval userId borligini tekshiramiz
  if (!userId) {
    throw new Error("Foydalanuvchi aniqlanmadi (userId is missing)");
  }

  const { categoryIds, ...movieData } = createMovieDto;
  
  const slug = movieData.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-');

  return this.prisma.movie.create({
    data: {
      ...movieData,
      slug,
      // createdById o'rniga connect ishlating:
      createdBy: {
        connect: { id: userId } 
      },
      categories: {
        create: categoryIds?.map((id) => ({
          categoryId: id,
        })),
      },
    },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });
}


  // 2. Barcha kinolarni qidiruv va sahifalash bilan olish
  async findAll(query: { search?: string; year?: number; page?: number; limit?: number } = {}) {
    const { search, year, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (year) {
      whereCondition.releaseYear = Number(year);
    }

    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where: whereCondition,
        skip,
        take: Number(limit),
        include: {
          categories: {
            include: { category: true },
          },
          createdBy: {
            select: { username: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.movie.count({ where: whereCondition }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  // 3. Bitta kinoni ID orqali olish
  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        createdBy: { select: { username: true } },
      },
    });

    if (!movie) throw new NotFoundException('Kino topilmadi');
    return movie;
  }

  // 4. Kinoni tahrirlash (Update)
  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const { categoryIds, ...movieData } = updateMovieDto;
    
    // Avval kino borligini tekshiramiz
    await this.findOne(id);

    let slug: string | undefined;
    if (movieData.title) {
      slug = movieData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }

    return this.prisma.movie.update({
      where: { id },
      data: {
        ...movieData,
        ...(slug && { slug }),
        categories: categoryIds ? {
          // Eski janr bog'liqliklarini o'chirib, yangilarini qo'shish
          deleteMany: {},
          create: categoryIds.map((catId) => ({
            categoryId: catId,
          })),
        } : undefined,
      },
      include: {
        categories: { include: { category: true } },
      },
    });
  }

  // 5. Kinoni o'chirish
  async remove(id: string) {
    // Kino borligini tekshirish
    await this.findOne(id);
    
    return this.prisma.movie.delete({ where: { id } });
  }
}