import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards 
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiBearerAuth, 
  ApiResponse 
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Categories (Kategoriyalar)')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Yangi kategoriya yaratish (Faqat Admin)' })
  @ApiResponse({ status: 201, description: 'Kategoriya muvaffaqiyatli yaratildi.' })
  @ApiResponse({ status: 403, description: 'Ruxsat yoʻq.' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha kategoriyalarni koʻrish' })
  @ApiResponse({ status: 200, description: 'Barcha kategoriyalar roʻyxati.' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta kategoriyani ID orqali koʻrish' })
  @ApiResponse({ status: 200, description: 'Kategoriya topildi.' })
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi.' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Kategoriyani tahrirlash (Faqat Admin)' })
  @ApiResponse({ status: 200, description: 'Kategoriya tahrirlandi.' })
  update(
    @Param('id') id: string, 
    @Body() updateCategoryDto: CreateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Kategoriyani oʻchirish (Faqat Admin)' })
  @ApiResponse({ status: 200, description: 'Kategoriya muvaffaqiyatli oʻchirildi.' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}