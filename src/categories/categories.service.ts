import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // 1. Slug yaratish: "Janr Nomi" -> "janr-nomi"
    const slug = createCategoryDto.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-'); // Bo'shliqlarni chiziqcha bilan almashtiradi

    // 2. Bazada bunaqa slug borligini tekshirish (Unique xatosi bermasligi uchun)
    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Bunday kategoriya (slug) allaqachon mavjud');
    }

    // 3. Bazaga saqlash
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
        slug: slug,
      },
    });
  }

 async findAll(search?: string, page: number = 1, limit: number = 10) {
  // Sahifalash uchun hisob-kitob (masalan: 2-sahifa uchun dastlabki 10 tasini tashlab o'tadi)
  const skip = (page - 1) * limit;

  // Qidiruv sharti
  const whereCondition = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { description: { contains: search, mode: 'insensitive' as const } },
    ],
  } : {};

  // Ma'lumotlarni va jami sonini bir vaqtda olish
  const [data, total] = await Promise.all([
    this.prisma.category.findMany({
      where: whereCondition,
      skip: skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }, // Yangilari birinchi chiqadi
      include: {
        _count: { select: { movies: true } }
      }
    }),
    this.prisma.category.count({ where: whereCondition })
  ]);

  return {
    data,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    }
  };
}
  // Bittasini olish
  async findOne(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  // Tahrirlash
  async update(id: string, updateCategoryDto: any) {
    const slug = updateCategoryDto.name 
      ? updateCategoryDto.name.toLowerCase().trim().replace(/\s+/g, '-') 
      : undefined;

    return this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto, slug },
    });
  }

  // O'chirish
  async remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}