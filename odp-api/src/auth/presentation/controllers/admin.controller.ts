import {
  Body,
  Controller,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Post,
  Query,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteUserCommand } from './../../../auth/application/commands/delete-user.command';
import { ResetPasswordCommand } from './../../../auth/application/commands/reset-password.command';
import { UpdateUserCommand } from './../../../auth/application/commands/update-user.command';
import { ResetPasswordDto } from './../../../auth/application/dtos/reset-password.dto';
import { UpdateUserDto } from './../../../auth/application/dtos/update-user.dto';
import { GetAllUsersQuery } from '../../application/queries/get-all-users.query';
import { UserEntity } from './../../../auth/domain/entities/user.entity';
import { RolesAndScopesGuard } from './../../../common/presentation/guards/roles-and-scopes.guard';
import { PaginatedResponseDto } from './../../../common/presentation/dtos/paginated-response.dto';
import { CreateUserCommand } from 'src/auth/application/commands/create-user.command';
import { CreateUserDto } from 'src/auth/application/dtos/create-user.dto';
import { GetUserByIdQuery } from 'src/auth/application/queries/get-user-by-id.query';

@Controller({
  path: 'admin',
  version: '1',
})
@ApiTags('admin')
@ApiBearerAuth() // ใช้ Bearer Token ในการเข้าถึง API นี้
@UseGuards(RolesAndScopesGuard)
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('users')
  @SetMetadata('roles', ['owner', 'admin']) // กำหนดว่าเฉพาะ owner, admin ที่สามารถเรียกใช้งานได้
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
    createUserDto.companyId = req.user?.companyId;
    const command = new CreateUserCommand(createUserDto, req.user);
    return await this.commandBus.execute(command);
  }

  @Get('users')
  @SetMetadata('roles', ['owner', 'admin']) // กำหนดว่าเฉพาะ owner, admin ที่สามารถเรียกใช้งานได้
  @ApiOperation({ summary: 'Get all users with pagination' })
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
    description: 'keyword',
    type: String,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'isActive',
    type: Boolean,
  })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy: string,
    @Query('sortType') sortType: 'asc' | 'desc',
    @Query('keyword') keyword: string,
    @Query('isActive') isActive: boolean,
    @Query('roles') roles: string,
    @Req() req,
  ): Promise<PaginatedResponseDto<UserEntity>> {
    sortBy = sortBy && sortBy.trim() !== '' ? sortBy : 'createdAt';
    return await this.queryBus.execute(
      new GetAllUsersQuery(
        page,
        limit,
        sortBy,
        sortType,
        keyword,
        isActive,
        roles,
        req.user,
      ),
    );
  }

  @Put('users/:id')
  @SetMetadata('roles', ['owner', 'admin']) // กำหนดว่าเฉพาะ owner, admin ที่สามารถเรียกใช้งานได้
  @ApiOperation({ summary: 'Update user details by admin' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    const command = new UpdateUserCommand(
      id,
      updateUserDto,
      req.user?.id || 'anonymous',
    );
    return await this.commandBus.execute(command);
  }

  @Delete('users/:id')
  @SetMetadata('roles', ['owner', 'admin']) // กำหนดว่าเฉพาะ owner, admin ที่สามารถเรียกใช้งานได้
  @ApiOperation({ summary: 'Delete a user by admin' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  async deleteUser(@Param('id') id: string): Promise<void> {
    const command = new DeleteUserCommand(id);
    await this.commandBus.execute(command);
  }

  @Post('users/reset-password/:username')
  @SetMetadata('roles', ['owner', 'admin']) // กำหนดว่าเฉพาะ owner, admin ที่สามารถเรียกใช้งานได้
  @ApiOperation({ summary: 'Reset password for a user by admin' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  async resetPassword(
    @Param('username') username: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    const { newPassword } = resetPasswordDto;
    const command = new ResetPasswordCommand(username, newPassword);
    await this.commandBus.execute(command);
  }

  @Get('users/:id')
  @SetMetadata('roles', ['owner', 'admin']) // กำหนดว่าเฉพาะ owner, admin ที่สามารถเรียกใช้งานได้
  @ApiOperation({ summary: 'Find a user by id' })
  @ApiResponse({ status: 200, description: 'User details' })
  async getUserById(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }
}
