import { Expose, Transform } from 'class-transformer';
import { Prop } from '@nestjs/mongoose';

export class CompanyEntity {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => (obj._id ? obj._id.toString() : null), {
    toClassOnly: true,
  })
  public id: string;

  @Expose()
  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Expose()
  @Prop({ type: String, unique: true, required: true })
  registerNo: string;

  @Expose()
  @Prop({ type: String, required: false })
  logoUrl: string;

  @Expose()
  @Prop({ type: String, default: null })
  companyShortName: string; // ชื่อย่อบริษัท

  @Expose()
  @Prop({ type: String, default: null })
  taxId: string; // เลขผู้เสียภาษี

  @Expose()
  @Prop({ type: String, default: null })
  address: string; // ที่ตั้ง

  @Expose()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Expose()
  @Prop({ type: Date })
  updatedAt: Date;

  @Expose()
  @Prop({ type: Object })
  createdBy: any;

  @Expose()
  @Prop({ type: Object })
  updatedBy: any;
}
