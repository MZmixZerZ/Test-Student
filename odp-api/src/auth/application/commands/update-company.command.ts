import { UpdateCompanyDto } from '../dtos/update-company.dto';

export class UpdateCompanyCommand {
  constructor(
    public readonly id: string,
    public readonly updateCompanyDto: UpdateCompanyDto,
    public readonly updatedBy: string,
  ) {}
}
