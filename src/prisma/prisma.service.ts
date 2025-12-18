import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Adapter sozlamalarini alohida o'zgaruvchiga olamiz
    const adapter = PrismaService.createAdapter();
    
    super({ adapter });
  }

  // Statik metod yordamida adapterni yaratish (kodni toza saqlash uchun)
  private static createAdapter() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    return new PrismaPg(pool);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ BAZA BILAN ALOQA Ornatildi!');
    } catch (error) {
      console.error('❌ BAZAGA ULANISHDA XATO:', error.message);
    }
  }

  // Dastur to'xtaganda ulanishni ham toza yopish kerak
  async onModuleDestroy() {
    await this.$disconnect();
  }
}