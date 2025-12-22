import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  // 1. Foydalanuvchining o'z profilini olish
  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { email: true, username: true, role: true }
        }
      }
    });

    if (!profile) throw new NotFoundException('Profil topilmadi');
    return { success: true, data: profile };
  }

  // 2. Profilni yangilash (Xavfsiz usulda)
  async updateProfile(userId: string, updateData: any) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profil topilmadi');

    // Xavfsizlik: Faqat ruxsat berilgan maydonlarni ajratamiz
    const { fullName, phone, country, avatarUrl } = updateData;

    // Agar yangi rasm yuklansa, eskisini o'chirish
    if (avatarUrl && profile.avatarUrl) {
      this.deletePhysicalFile(profile.avatarUrl);
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        fullName: fullName ?? profile.fullName,
        phone: phone ?? profile.phone,
        country: country ?? profile.country,
        avatarUrl: avatarUrl ?? profile.avatarUrl,
      },
    });

    return { success: true, message: 'Profil yangilandi', data: updatedProfile };
  }

  // Yordamchi: Rasmni o'chirish
  private deletePhysicalFile(filePath: string) {
    try {
      const fullPath = join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch (err) {
      console.error('Fayl o‘chirishda xato:', err);
    }
  }
}