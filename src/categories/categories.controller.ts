import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; // Standart guard
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Categories (Janrlar)')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Yangi janr qoʻshish (Admin/Superadmin)' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get() // Hamma ko'ra oladi, Guard shart emas (ixtiyoriy)
  @ApiOperation({ summary: 'Barcha janrlarni koʻrish' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Janrni tahrirlash (Admin/Superadmin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({ summary: 'Janrni oʻchirish (Faqat Superadmin)' })
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}