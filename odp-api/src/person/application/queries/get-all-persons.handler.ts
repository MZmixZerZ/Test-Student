import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPersonsQuery } from './get-all-persons.query';
import { PersonRepository } from '../../infrastructure/repositories/person.repository';
import { PersonEntity } from '../../domain/entities/person.entity';
import { PaginatedResponseDto } from 'src/common/presentation/dtos/paginated-response.dto';

@QueryHandler(GetAllPersonsQuery)
export class GetAllPersonsHandler
  implements IQueryHandler<GetAllPersonsQuery>
{
  constructor(
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(
    query: GetAllPersonsQuery,
  ): Promise<PaginatedResponseDto<PersonEntity>> {
    const { page, limit, sortBy, sortType, keyword, name, surname } = query;

    const persons = await this.personRepository.findAllPaginated(
      page,
      limit,
      sortBy,
      sortType,
      keyword,
      undefined, // companyId (ไม่ใช้)
      name,
      surname
    );

    const totalItems = persons.totalCount;

    return new PaginatedResponseDto(persons.data, totalItems, limit, page);
  }
}
