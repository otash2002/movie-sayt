import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Dashboard (Statistika)')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Admin paneli uchun umumiy statistika' })
  async getStats() {
    return this.dashboardService.getStats();
  }
}