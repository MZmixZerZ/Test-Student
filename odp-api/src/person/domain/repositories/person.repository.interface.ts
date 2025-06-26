import { PersonEntity } from '../entities/person.entity';

export interface PersonRepositoryInterface {
  // บันทึกข้อมูลใหม่
  save(person: PersonEntity): Promise<PersonEntity>;

  // ค้นหาโดยใช้ ID
  findById(id: string): Promise<PersonEntity | null>;

  // ค้นหาโดยใช้ Name
  findByName(name: string): Promise<PersonEntity | null>;

  // ดึงข้อมูลทั้งหมด (แบบแบ่งหน้า)
  findAllPaginated(
    page: number,
    limit: number,
    sortBy: string,
    sortType: string,
    keyword: string,
    companyId: string,
  ): Promise<{ data: PersonEntity[]; totalCount: number }>

  // นับจำนวนทั้งหมด
  count(): Promise<number>;

  // อัปเดตข้อมูล
  update(person: PersonEntity): Promise<PersonEntity>;

  // ลบตาม ID
  delete(id: string): Promise<void>;
}
