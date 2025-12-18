import { Controller, Get, Post, Body } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Movies (Kinolar)') // Swagger-da alohida bo'lim
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi kino qoʻshish' })
  async create(@Body() createMovieDto: CreateMovieDto) {
    // Hozircha hamma ma'lumotni DTO orqali qo'lda yuboramiz
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha kinolar roʻyxatini olish' })
  async findAll() {
    return this.moviesService.findAll();
  }
}