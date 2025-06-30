import { Expose, Transform } from 'class-transformer';
import { Person } from 'src/person/infrastructure/persistence/person.schema';


export class MemberEntity {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => (obj._id ? obj._id.toString() : null), {
    toClassOnly: true,
  })
  public id: string;

  @Expose()
  memberid: string; // รหัสสมาชิก

  @Expose()
  // @Transform(({ obj }) => obj.person?.idCard ?? null, { toClassOnly: true })
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
