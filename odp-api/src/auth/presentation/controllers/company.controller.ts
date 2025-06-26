import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SetMetadata } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateCompanyDto } from '../../application/dtos/update-company.dto';
import { UpdateCompanyCommand } from '../../application/commands/update-company.command';
import { RolesAndScopesGuard } from '../../../common/presentation/guards/roles-and-scopes.guard';
import { GetCompanyByIdQuery } from '../../application/queries/get-company-by-id.query';

@ApiTags('companies')
@Controller('companies')
@ApiBearerAuth() // ใช้ Bearer Token ในการเข้าถึง API นี้
@UseGuards(RolesAndScopesGuard) // ใช้ RolesGuard กับทั้ง controller
export class CompanyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiResponse({ status: 200, description: 'Company details' })
  async getCompanyById(@Param('id') userId: string) {
    return await this.queryBus.execute(new GetCompanyByIdQuery(userId));
  }

  @Put(':id')
  @SetMetadata('roles', ['owner', 'admin']) // กำหนดว่าเฉพาะ admin ที่สามารถอัปเดตได้
  @ApiOperation({ summary: 'Update a company by ID' })
  @ApiResponse({ status: 200, description: 'Company successfully updated' })
  async updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req,
  ) {
    const command = new UpdateCompanyCommand(
      id,
      updateCompanyDto,
      req.user?.id || 'anonymous',
    );
    return await this.commandBus.execute(command);
  }
}
