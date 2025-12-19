import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Prisma bilan bog'lash
import { AuthModule } from '../auth/auth.module';     // Auth (JWT) bilan bog'lash

@Module({
  imports: [
    PrismaModule, // Bazaga yozish uchun shart
    AuthModule    // JwtStrategy va AuthGuard ishlashi uchun shart
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}