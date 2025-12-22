import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, Query, Req, UseInterceptors, UploadedFile,
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Movies (Kinolar)')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('poster', {
    storage: diskStorage({
      destination: './uploads/posters',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(
    @Body() createMovieDto: CreateMovieDto,
    @Req() req: any,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
      ],
      fileIsRequired: false
    })) file: Express.Multer.File
  ) {
    const posterUrl = file ? `/uploads/posters/${file.filename}` : undefined;
    return this.moviesService.create({ ...createMovieDto, posterUrl }, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Kinolarni qidirish va filtrlash' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: any) {
    return this.moviesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('poster', {
    storage: diskStorage({
      destination: './uploads/posters',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
      ],
      fileIsRequired: false
    })) file: Express.Multer.File
  ) {
    const posterUrl = file ? `/uploads/posters/${file.filename}` : undefined;
    return this.moviesService.update(id, { ...updateMovieDto, posterUrl });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}