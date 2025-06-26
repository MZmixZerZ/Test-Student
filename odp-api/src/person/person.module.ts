import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Reflector } from '@nestjs/core';
import { RolesAndScopesGuard } from 'src/common/presentation/guards/roles-and-scopes.guard';
import { PersonController } from './presentation/controllers/person.controller';
import { CreatePersonHandler } from './application/commands/create-person.handler';
import { UpdatePersonHandler } from './application/commands/update-person.handler';
import { DeletePersonHandler } from './application/commands/delete-person.handler';
import { GetAllPersonsHandler } from './application/queries/get-all-persons.handler';
import { GetPersonByIdHandler } from './application/queries/get-person-by-id.handler';
import { PersonRepository } from './infrastructure/repositories/person.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonSchema } from './infrastructure/persistence/person.schema';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: 'Person', schema: PersonSchema }])
  ],
  controllers: [PersonController],
  providers: [
    CreatePersonHandler,
    UpdatePersonHandler,
    DeletePersonHandler,
    GetAllPersonsHandler,
    GetPersonByIdHandler,
    PersonRepository,
    Reflector,
    RolesAndScopesGuard,
  ],
  exports: [
    PersonRepository,
  ],
})
export class PersonModule {}