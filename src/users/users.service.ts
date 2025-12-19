import { 
  Injectable, 
  ConflictException, 
  InternalServerErrorException, 
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(username: string, email: string, pass: string) {
    try {
      return await this.prisma.user.create({
        data: {
          username: username,
          email: email,
          passwordHash: pass,
        },
      });
    } catch (error) {
      // P2002 - Prisma-da "Unique constraint" xatosi (Email yoki Username band bo'lsa)
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        throw new ConflictException(
          `Xato: Bu ${target} allaqachon ro'yxatdan o'tgan! Iltimos, boshqasini kiriting.`
        );
      }

      // Agar boshqa Prisma xatosi bo'lsa
      if (error.code) {
        throw new BadRequestException(`Ma'lumotlar bazasi xatosi: ${error.code}`);
      }

      // Kutilmagan texnik xatoliklar uchun
      throw new InternalServerErrorException("Serverda foydalanuvchi yaratishda xatolik yuz berdi");
    }
  }

  async findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}