import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { MoviesModule } from './movies/movies.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env ni o'qish uchun
    PrismaModule, 
    AuthModule, 
    UsersModule, CategoriesModule, MoviesModule, DashboardModule, ProfileModule
  ],
})
export class AppModule {}