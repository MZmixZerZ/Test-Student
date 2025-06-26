import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyByIdQuery } from './get-company-by-id.query';
import { CompanyRepositoryInterface } from '../../domain/repositories/company.repository.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';

@QueryHandler(GetCompanyByIdQuery)
export class GetCompanyByIdHandler
  implements IQueryHandler<GetCompanyByIdQuery>
{
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepositoryInterface,
  ) {}

  async execute(
    query: GetCompanyByIdQuery,
  ): Promise<ResponseDto<CompanyEntity>> {
    const { id } = query;

    // ดึงข้อมูลผู้สมัครตาม ID
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return new ResponseDto<CompanyEntity>(company);
  }
}
