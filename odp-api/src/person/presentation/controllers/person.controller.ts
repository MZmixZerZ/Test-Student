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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePersonDto } from '../../application/dtos/create-person.dto';
import { UpdatePersonDto } from '../../application/dtos/update-person.dto';
import { CreatePersonCommand } from '../../application/commands/create-person.command';
import { UpdatePersonCommand } from '../../application/commands/update-person.command';
import { GetAllPersonsQuery } from '../../application/queries/get-all-persons.query';
import { RolesAndScopesGuard } from '../../../common/presentation/guards/roles-and-scopes.guard';
import { DeletePersonCommand } from '../../application/commands/delete-person.command';
import { GetPersonByIdQuery } from '../../application/queries/get-person-by-id.query';

@ApiTags('persons')
@Controller('persons')
@ApiBearerAuth()
@UseGuards(RolesAndScopesGuard)
export class PersonController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @SetMetadata('roles', ['owner', 'admin'])
  @ApiOperation({ summary: 'Create a new person' })
  @ApiResponse({ status: 201, description: 'Person successfully created' })
  async createPerson(
    @Body() createPersonDto: CreatePersonDto,
    @Req() req: any,
  ): Promise<any> {
    // companyId ถูกถอดออกจาก DTO และ Command ตาม repo
    const command = new CreatePersonCommand(createPersonDto, req.user);
    return this.commandBus.execute(command);
  }

  @Get()
  @ApiOperation({ summary: 'Get all persons with pagination and filter' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field name', type: String })
  @ApiQuery({ name: 'sortType', required: false, description: 'Sort type order by asc desc', type: String })
  @ApiQuery({ name: 'keyword', required: false, description: 'Keyword for search', type: String })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name', type: String })
  @ApiQuery({ name: 'surname', required: false, description: 'Filter by surname', type: String })
  @ApiResponse({ status: 200, description: 'List of all persons' })
  async getAllPersons(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy?: string,
    @Query('sortType') sortType?: 'asc' | 'desc',
    @Query('keyword') keyword?: string,
    @Query('name') name?: string,
    @Query('surname') surname?: string,
  ) {
    const safeSortBy = sortBy && sortBy.trim() !== '' ? sortBy : 'createdAt';
    return this.queryBus.execute(
      new GetAllPersonsQuery(page, limit, safeSortBy, sortType, keyword, name, surname, req.user),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a person by ID' })
  @ApiResponse({ status: 200, description: 'Person details' })
  async getPersonById(@Param('id') id: string) {
    return this.queryBus.execute(new GetPersonByIdQuery(id));
  }

  @Put(':id')
  @SetMetadata('roles', ['owner', 'admin'])
  @ApiOperation({ summary: 'Update a person by ID' })
  @ApiResponse({ status: 200, description: 'Person successfully updated' })
  async updatePerson(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
    @Req() req: any,
  ) {
    // companyId ถูกถอดออกจาก DTO และ Command ตาม repo
    const command = new UpdatePersonCommand(id, updatePersonDto, req.user);
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @SetMetadata('roles', ['owner', 'admin'])
  @ApiOperation({ summary: 'Delete a person by ID' })
  @ApiResponse({ status: 200, description: 'Person successfully deleted' })
  async deletePerson(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeletePersonCommand(id));
  }
}