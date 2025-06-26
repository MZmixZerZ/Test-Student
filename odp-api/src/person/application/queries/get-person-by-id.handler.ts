import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPersonByIdQuery } from './get-person-by-id.query';
import { PersonRepository } from '../../infrastructure/repositories/person.repository';
import { PersonEntity } from '../../domain/entities/person.entity';

@QueryHandler(GetPersonByIdQuery)
export class GetPersonByIdHandler implements IQueryHandler<GetPersonByIdQuery> {
  constructor(
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(query: GetPersonByIdQuery): Promise<PersonEntity | null> {
    return this.personRepository.findById(query.id);
  }
}
