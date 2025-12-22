import { 
  Controller, Get, Put, Body, Req, UseGuards, 
  UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'O‘z profilini ko‘rish' })
  async getProfile(@Req() req: any) {
    return this.profileService.getProfile(req.user.sub);
  }

  @Put()
  @ApiOperation({ summary: 'Profil ma’lumotlarini yangilash' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar')) // Faqat bitta interceptor bo'lishi shart
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarUrl = file ? `/uploads/avatars/${file.filename}` : undefined;
    
    return this.profileService.updateProfile(req.user.sub, { 
      ...updateProfileDto, 
      avatarUrl 
    });
  }
}