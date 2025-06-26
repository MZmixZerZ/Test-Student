import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { CompanyEntity } from 'src/auth/domain/entities/company.entity';


@Schema()
export class Company extends CompanyEntity {}

export const CompanySchema = SchemaFactory.createForClass(Company);
