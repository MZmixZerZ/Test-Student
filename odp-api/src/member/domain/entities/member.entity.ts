import { Expose, Transform } from 'class-transformer';

export class MemberEntity {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => (obj._id ? obj._id.toString() : null), {
    toClassOnly: true,
  })
  public id: string;

  @Expose()
  memberId: string; // รหัสสมาชิก

  @Expose()
  idCard: string; // เลขบัตรประชาชน

  @Expose()
  organization: string; // องค์กร

  @Expose()
  contactPerson: string; // ผู้ติดต่อ

  @Expose()
  contactPhone: string; // เบอร์ผู้ติดต่อ

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  createdBy: any;

  @Expose()
  updatedBy: any;
}
