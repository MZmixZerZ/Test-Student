import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';

export class MemberEntity {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => (obj._id ? obj._id.toString() : null), {
    toClassOnly: true,
  })
  public id: string;

  @Expose()
  @Prop({ type: String, required: true, unique: true })
  memberId: string; // รหัสสมาชิก (increment หรือ unique)

  @Expose()
  @Prop({ type: String, required: true })
  idCard: string; // เลขบัตรประชาชน

  @Expose()
  @Prop({ type: String, required: true })
  organization: string; // องค์กร

  @Expose()
  @Prop({ type: String, required: true })
  contactPerson: string; // ผู้ติดต่อ

  @Expose()
  @Prop({ type: String, required: true })
  contactPhone: string; // เบอร์ผู้ติดต่อ

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
