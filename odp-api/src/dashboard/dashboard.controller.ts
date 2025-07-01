import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesAndScopesGuard } from '../common/presentation/guards/roles-and-scopes.guard';
import { DashboardService } from 'src/dashboard/dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
@ApiBearerAuth()
@UseGuards(RolesAndScopesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary with counts of members, organizations, and persons' })
  @ApiResponse({ status: 200, description: 'Dashboard summary data' })
  async getSummary() {
    return this.dashboardService.getSummary();
  }
}
