import {Injectable, 
  BadRequestException, 
  NotFoundException, 
  InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}
async create(dto: CreateMovieDto) {
  try {
    const { categoryIds, createdById, ...movieData } = dto;

    return await this.prisma.movie.create({
      data: {
        ...movieData,
        createdBy: { connect: { id: createdById } },
        categories: {
          create: categoryIds?.map((id) => ({
            category: { connect: { id } }
          })),
        },
      },
      include: {
        categories: { include: { category: true } }
      }
    });
  } catch (error) {
    // 1. Agar ID topilmasa (User yoki Category xato bo'lsa)
    if (error.code === 'P2025') {
      throw new NotFoundException(`Xato: Berilgan ID-lardan biri bazada topilmadi. User yoki Category ID-sini qayta tekshiring.`);
    }
    
    // 2. Agar Slug takrorlansa (Unique constraint)
    if (error.code === 'P2002') {
      throw new BadRequestException(`Xato: '${dto.slug}' slugi band. Boshqa slug tanlang.`);
    }

    // 3. Qolgan barcha xatolar uchun
    console.error(error); // Terminalda to'liq xatoni ko'rish uchun
    throw new InternalServerErrorException("Serverda kutilmagan xatolik!");
  }
}
  // 2. Qidiruv, Filtr va Sahifalash bilan barcha kinolarni olish
  async findAll(query: { search?: string; year?: number; page?: number; limit?: number }) {
    const { search, year, page = 1, limit = 10 } = query;
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    return this.prisma.movie.findMany({
      where: {
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
        releaseYear: year ? Number(year) : undefined,
      },
      take,
      skip,
      include: {
        categories: { include: { category: true } },
      },
    });
  }


  // 3. Bitta kinoni ID orqali ko'rish
  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        createdBy: true
      }
    });
    if (!movie) throw new NotFoundException("Kino topilmadi");
    return movie;
  }

  // 4. Kinoni o'chirish
  async remove(id: string) {
    // Avval oraliq jadvaldagi bog'liqliklarni o'chirish kerak bo'lishi mumkin 
    // (Agar Prisma-da Cascade o'rnatilmagan bo'lsa)
    await this.prisma.movieCategory.deleteMany({ where: { movieId: id } });
    return this.prisma.movie.delete({ where: { id } });
  }
}