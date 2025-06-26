import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCompanyCommand } from './update-company.command';
import { CompanyRepositoryInterface } from '../../domain/repositories/company.repository.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { CompanyEntity } from 'src/auth/domain/entities/company.entity';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';

@CommandHandler(UpdateCompanyCommand)
export class UpdateCompanyHandler
  implements ICommandHandler<UpdateCompanyCommand>
{
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepositoryInterface,
  ) {}

  async execute(
    command: UpdateCompanyCommand,
  ): Promise<ResponseDto<CompanyEntity>> {
    const { id, updateCompanyDto, updatedBy } = command;

    // หา Company จาก ID
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    Object.assign(company, updateCompanyDto);
    company.updatedAt = new Date();
    company.updatedBy = updatedBy;
    // อัปเดตข้อมูลในฐานข้อมูล

    const updCompany = await this.companyRepository.update(company);
    return new ResponseDto<CompanyEntity>(updCompany);
  }
}
