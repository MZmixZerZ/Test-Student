import { MemberEntity } from '../entities/member.entity';

export interface MemberRepositoryInterface {
  // บันทึกข้อมูลใหม่
  save(member: MemberEntity): Promise<MemberEntity>;

  // ค้นหาโดยใช้ ID
  findById(id: string): Promise<MemberEntity | null>;

  // ค้นหาโดยใช้ Name
  findByName(name: string): Promise<MemberEntity | null>;

  // ดึงข้อมูลทั้งหมด (แบบแบ่งหน้า)
  findAllPaginated(
    page: number,
    limit: number,
    sortBy: string,
    sortType: string,
    keyword: string,
    companyId: string,
  ): Promise<{ data: MemberEntity[]; totalCount: number }>

  // นับจำนวนทั้งหมด
  count(): Promise<number>;

  // อัปเดตข้อมูล
  update(member: MemberEntity): Promise<MemberEntity>;

  // ลบตาม ID
  delete(id: string): Promise<void>;
}
