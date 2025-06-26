import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CompanyRepositoryInterface } from 'src/auth/domain/repositories/company.repository.interface';
import { CompanyEntity } from 'src/auth/domain/entities/company.entity';
import { Company } from '../persistence/company.schema';

export class CompanyRepository implements CompanyRepositoryInterface {
  constructor(
    @InjectModel('Company') private readonly companyModel: Model<Company>,
  ) {}

  async save(company: CompanyEntity): Promise<CompanyEntity> {
    const createdCompany = new this.companyModel(company);
    const savedCompany = await createdCompany.save();
    return this.mapToEntity(savedCompany);
  }

  async update(company: CompanyEntity): Promise<CompanyEntity> {
    return await this.companyModel.findByIdAndUpdate(company.id, company);
  }

  async delete(id: string): Promise<void> {
    await this.companyModel.deleteOne({ _id: id }).exec();
  }

  async findById(id: string): Promise<CompanyEntity | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const objectId = new Types.ObjectId(id);
    const company = await this.companyModel.findById(objectId).exec();
    return company ? this.mapToEntity(company) : null;
  }

  private mapToEntity(company: any): CompanyEntity {
    const plainObject = company.toObject();
    const entity = plainToInstance(CompanyEntity, plainObject, {
      excludeExtraneousValues: true,
    });

    return entity;
  }
}
