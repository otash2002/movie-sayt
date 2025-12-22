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
        username,
        email,
        passwordHash: pass,
        profile: {
          create: { fullName: username },
        },
      },
    });
  } catch (error) {
  // P2002 - Prisma Unique constraint xatosi
  if (error.code === 'P2002') {
    // meta.target har doim ham massiv bo'lmasligi mumkin, shuni tekshiramiz
    const target = error.meta?.target;
    const targetString = Array.isArray(target) ? target.join(', ') : String(target || '');

    if (targetString.includes('username')) {
      throw new ConflictException('Bu foydalanuvchi nomi (username) allaqachon band!');
    }
    
    if (targetString.includes('email')) {
      throw new ConflictException('Bu elektron pochta (email) allaqachon ro‘yxatdan o‘tgan!');
    }

    throw new ConflictException(`Bu ma’lumot allaqachon mavjud: ${targetString}`);
  }

  // Agar boshqa xato bo'lsa, konsolga chiqaradi va 500 beradi
  console.error('Kutilmagan xato:', error);
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