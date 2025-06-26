import { Expose, Transform } from 'class-transformer';
import { Prop } from '@nestjs/mongoose';
import { Role } from '../../application/enums/role.enum';

export class UserEntity {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => (obj._id ? obj._id.toString() : null), {
    toClassOnly: true,
  })
  public id: string;

  @Expose()
  @Prop({ type: String, unique: true, required: true })
  username: string;

  // ไม่ควร expose password ออกไปนอกระบบ
  @Prop({ type: String, required: true, select: false })
  password: string;

  @Expose()
  @Prop({ type: String })
  email: string;

  @Expose()
  @Prop({ type: String })
  phoneNumber: string;

  @Expose()
  @Prop({
    required: true,
    enum: Role,
  })
  role: string; // บทบาทของผู้ใช้

  @Expose()
  @Prop({ required: true })
  companies: [string]; // รหัสบริษัทที่ผู้ใช้อยู่ (เป็น Array) ได้หลายบริษัท

  @Expose()
  @Prop({ type: String })
  companySelected: string; // id ของ company ที่เลือก

  @Expose()
  @Prop({ type: String, required: true })
  fullName: string;

  @Expose()
  @Prop({ type: Boolean, default: true })
  isActive: boolean;

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
