import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SetMetadata } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMemberDto } from '../../application/dtos/create-member.dto';
import { UpdateMemberDto } from '../../application/dtos/update-member.dto';
import { CreateMemberCommand } from '../../application/commands/create-member.command';
import { UpdateMemberCommand } from '../../application/commands/update-member.command';
import { GetAllMembersQuery } from '../../application/queries/get-all-members.query';
import { RolesAndScopesGuard } from '../../../common/presentation/guards/roles-and-scopes.guard';
import { DeleteMemberCommand } from '../../application/commands/delete-member.command';
import { GetMemberByIdQuery } from '../../application/queries/get-member-by-id.query';

@ApiTags('members')
@Controller('members')
@ApiBearerAuth() // ใช้ Bearer Token ในการเข้าถึง API นี้
@UseGuards(RolesAndScopesGuard) // ใช้ RolesGuard กับทั้ง controller
export class MemberController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @SetMetadata('roles', ['owner', 'admin']) // กำหนดว่าเฉพาะ admin ที่สามารถเรียกใช้งานได้
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ status: 201, description: 'Member successfully created' })
  async createMember(
    @Body() createMemberDto: CreateMemberDto,
    @Req() req,
  ) {
    const command = new CreateMemberCommand(
      createMemberDto,
      req.user,
    );
    return await this.commandBus.execute(command);
  }

  @Get()
  @ApiOperation({ summary: 'Get all members with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'sort by field name',
    type: String,
  })
  @ApiQuery({
    name: 'sortType',
    required: false,
    description: 'sort type order by asc desc',
    type: String,
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'keyword for search',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'List of all members' })
  async getAllMembers(
    @Query('page') page = 1, 
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy: string,
    @Query('sortType') sortType: 'asc' | 'desc',
    @Query('keyword') keyword: string,
    @Req() req,
  ) {
    sortBy = sortBy && sortBy.trim() !== '' ? sortBy : 'createdAt';
    return await this.queryBus.execute(new GetAllMembersQuery(page, limit, sortBy, sortType, keyword, req.user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a member by ID' })
  @ApiResponse({ status: 200, description: 'Member details' })
  async getMemberById(@Param('id') id: string) {
    return await this.queryBus.execute(new GetMemberByIdQuery(id));
  }

  @Put(':id')
  @SetMetadata('roles', ['owner', 'admin']) // กำหนดว่าเฉพาะ admin ที่สามารถเรียกใช้งานได้
  @ApiOperation({ summary: 'Update a member by ID' })
  @ApiResponse({ status: 200, description: 'Member successfully updated' })
  async updateMember(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @Req() req,
  ) {
    const command = new UpdateMemberCommand(
      id, 
      updateMemberDto,
      req.user,
    );
    return await this.commandBus.execute(command);
  }

  @Delete(':id')
  @SetMetadata('roles', ['owner', 'admin']) // กำหนดว่าเฉพาะ admin ที่สามารถเรียกใช้งานได้
  @ApiOperation({ summary: 'Delete a member by ID' })
  @ApiResponse({ status: 200, description: 'Member successfully deleted' })
  async deleteMember(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteMemberCommand(id));
  }
}
