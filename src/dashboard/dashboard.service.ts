import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [moviesCount, usersCount, categoriesCount, latestMovies] = await Promise.all([
      this.prisma.movie.count(),
      this.prisma.user.count(),
      this.prisma.category.count(),
      this.prisma.movie.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { categories: { include: { category: true } } }
      }),
    ]);

    return {
      totalMovies: moviesCount,
      totalUsers: usersCount,
      totalCategories: categoriesCount,
      recentMovies: latestMovies,
    };
  }
}