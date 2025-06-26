import { CompanyEntity } from '../entities/company.entity';

export interface CompanyRepositoryInterface {
  save(company: CompanyEntity): Promise<CompanyEntity>;

  update(company: CompanyEntity): Promise<CompanyEntity>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<CompanyEntity | null>;
}
