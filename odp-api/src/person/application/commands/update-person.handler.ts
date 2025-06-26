import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePersonCommand } from './update-person.command';
import { PersonRepository } from '../../infrastructure/repositories/person.repository';
import { NotFoundException } from '@nestjs/common';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';
import { PersonEntity } from 'src/person/domain/entities/person.entity';

@CommandHandler(UpdatePersonCommand)
export class UpdatePersonHandler
  implements ICommandHandler<UpdatePersonCommand>
{
  constructor(
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(command: UpdatePersonCommand): Promise<ResponseDto<PersonEntity>> {
    const { id, updatePersonDto, updatedBy  } = command;

    // หา Person จาก ID
    const person = await this.personRepository.findById(id);
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    Object.assign(person, updatePersonDto);
    // อัปเดตข้อมูลวันที่และผู้แก้ไข (ถ้ามี field ใน entity)
    person.updatedAt = new Date();
    person.updatedBy = updatedBy.id;

    // อัปเดตข้อมูลในฐานข้อมูล
    const updPerson = await this.personRepository.update(person);
    return new ResponseDto<PersonEntity>(updPerson);
  }
}
