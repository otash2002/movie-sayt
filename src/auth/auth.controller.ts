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
import { 
  ApiTags, 
  ApiOperation, 
  ApiBearerAuth, 
  ApiResponse 
} from '@nestjs/swagger';

@ApiTags('Auth (Avtorizatsiya)')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yangi foydalanuvchi roʻyxatdan oʻtkazish' })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi muvaffaqiyatli yaratildi' })
  async signUp(@Body() body: SignupDto) {
    return this.authService.signUp(body.username, body.email, body.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tizimga kirish va JWT token olish' })
  @ApiResponse({ status: 200, description: 'Token muvaffaqiyatli qaytarildi' })
  @ApiResponse({ status: 401, description: 'Login yoki parol xato' })
  async signIn(@Body() body: LoginDto) {
    return this.authService.signIn(body.username, body.password);
  }

  // --- Himoyalangan endpointlar ---

  @ApiBearerAuth('access-token') // main.ts dagi nom bilan bir xil bo'lishi shart
  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Tizimga kirgan foydalanuvchi profilini koʻrish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi ma’lumotlari qaytdi' })
  @ApiResponse({ status: 401, description: 'Token yaroqsiz yoki topilmadi' })
  getProfile(@Request() req) {
    // req.user ma'lumotlari AuthGuard ichida request['user'] = payload orqali yuklanadi
    if (!req.user) {
      return { 
        message: "Guard'dan o'tdi, lekin req.user bo'sh!", 
        debug: "AuthGuard faylida request['user'] = payload qatori borligini tekshiring" 
      };
    }
    return req.user;
  }

  @ApiBearerAuth('access-token') // Bu yerda ham nomni ko'rsatamiz
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get('users')
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish (Faqat Admin/Superadmin)' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar ro‘yxati' })
  @ApiResponse({ status: 403, description: 'Ruxsat etilmagan (Forbidden)' })
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Get('test')
  @ApiOperation({ summary: 'Server holatini tekshirish (Public)' })
  testGet() {
    return { 
      status: 'success', 
      message: "Server ishlayapti, GET so'rovi qabul qilindi!" 
    };
  }
}