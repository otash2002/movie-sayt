import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query, 
  Req 
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiBearerAuth, 
  ApiResponse, 
  ApiQuery 
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Movies (Kinolar)')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
@Post()
@ApiOperation({ summary: 'Yangi kino qoʻshish (Faqat Admin)' })
@ApiResponse({ status: 201, description: 'Kino muvaffaqiyatli yaratildi.' })
// @Req() req: any qismini Swagger e'tiborsiz qoldirishi uchun:
create(@Body() createMovieDto: CreateMovieDto, @Req() req: any) {
  // req.user.sub ichida login qilgan foydalanuvchining ID si bo'ladi
  return this.moviesService.create(createMovieDto, req.user.sub);
}
  @Get()
  @ApiOperation({ summary: 'Barcha kinolarni koʻrish va qidirish' })
  @ApiQuery({ name: 'search', required: false, description: 'Kino nomi yoki tavsifi boʻyicha qidirish' })
  @ApiQuery({ name: 'year', required: false, description: 'Chiqarilgan yili boʻyicha filtr' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(
    @Query('search') search?: string,
    @Query('year') year?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.moviesService.findAll({ search, year, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta kinoni ID orqali koʻrish' })
  @ApiResponse({ status: 200, description: 'Kino topildi.' })
  @ApiResponse({ status: 404, description: 'Kino topilmadi.' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Kino maʼlumotlarini tahrirlash (Faqat Admin)' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Kinoni oʻchirish (Faqat Admin)' })
  @ApiResponse({ status: 200, description: 'Kino muvaffaqiyatli oʻchirildi.' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}