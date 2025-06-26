import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';

export class PersonEntity {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => (obj._id ? obj._id.toString() : null), {
    toClassOnly: true,
  })
  public id: string;

  @Expose()
  @Prop({ type: String, required: true, unique: true })
  n_id: string; // เพิ่ม field เลขบัตรประชาชน (n_id) ให้ตรงกับ repo

  @Expose()
  @Prop({ type: String, required: true })
  name: string;

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

  @Expose()
  @Prop({ type: String })
  surname: string;

  @Expose()
  @Prop({ type: Date })
  dob: Date;

  @Expose()
  @Prop({ type: String })
  phone: string;

  @Expose()
  @Prop({ type: String })
  nationality: string;

  @Expose()
  @Prop({ type: String })
  citizen: string;

  @Expose()
  @Prop({ type: String })
  religion: string;

  @Expose()
  @Prop({ type: String })
  address: string;
}
