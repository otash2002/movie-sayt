import { Controller, Get, Post, Body, Query, UseGuards, Param, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiResponse, ApiTags,ApiQuery, ApiBadRequestResponse, ApiNotFoundResponse} from '@nestjs/swagger'; // ApiQuery qo'shildi
import { CreateMovieDto } from './dto/create-movie.dto';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
@Post()
  @ApiOperation({ summary: 'Yangi kino yaratish' })
  @ApiResponse({ status: 201, description: 'Kino muvaffaqiyatli yaratildi.' })
  @ApiBadRequestResponse({ description: 'Slug band yoki maʼlumotlar xato yuborilgan.' })
  @ApiNotFoundResponse({ description: 'User ID yoki Category ID topilmadi.' })
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Kinolarni qidirish, filtrlash va sahifalash' })
  // Swaggerda maydonchalarni chiqarish:
  @ApiQuery({ name: 'search', required: false, description: 'Kino nomi bo‘yicha qidiruv' })
  @ApiQuery({ name: 'year', required: false, description: 'Chiqarilgan yili', type: Number })
  @ApiQuery({ name: 'page', required: false, description: 'Sahifa raqami (default: 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Har bir sahifadagi kinolar soni (default: 10)', type: Number })
  async findAll(
    @Query('search') search?: string,
    @Query('year') year?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.moviesService.findAll({ search, year, page, limit });
  }
}