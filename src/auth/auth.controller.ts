import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from './roles.guard';
import { Role } from '@prisma/client';
import { Roles } from './roles.decorator';

import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish va JWT olish' }) // Izoh to'g'rilandi
  async signIn(@Body() body: LoginDto) {
    // Record o'rniga LoginDto qo'yildi
    // Endi Swagger login uchun nima kerakligini ko'rsatadi
    return this.authService.signIn(body.username, body.password);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Yangi foydalanuvchi roʻyxatdan oʻtkazish' }) // Izoh to'g'rilandi
  async signUp(@Body() body: SignupDto) {
    // 'any' o'rniga SignupDto qo'yildi
    // Endi Swagger bu yerda username, email va password borligini biladi
    return this.authService.signUp(body.username, body.email, body.password);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Foydalanuvchi profilini koʻrish (Token kerak)' })
  getProfile(@Request() req) {
    return req.user;
  }

  // Siz boya aytgan barcha userlarni ko'rish metodi:
  @ApiBearerAuth()
  @Get('users')
  @UseGuards(AuthGuard, RolesGuard) // Endi ikkita "bojxona"dan o'tadi
  @Roles(Role.SUPERADMIN, Role.ADMIN) // Faqat bu rollar o'ta oladi
  @ApiOperation({
    summary: 'Barcha foydalanuvchilarni olish (Admin/Superadmin)',
  })
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
  @Get('test')
  @ApiOperation({ summary: 'GET soʻrovini tekshirish' })
  testGet() {
    return { message: "GET so'rovi muvaffaqiyatli ishlayapti!" };
  }
}
