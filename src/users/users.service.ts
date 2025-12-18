import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client'; // Faqat shu qolishi kerak
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. Argumentga email ni qo'shing
  async create(username: string, email: string, pass: string) {
  return this.prisma.user.create({
    data: {
      username: username,
      email: email,
      passwordHash: pass,
    },
  });
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
        // Parolni (passwordHash) chiqarmaymiz, xavfsizlik uchun!
      },
    });
  }
}