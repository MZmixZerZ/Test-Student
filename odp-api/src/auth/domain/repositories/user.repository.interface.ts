import { UserEntity } from '../entities/user.entity';

export interface UserRepositoryInterface {
  // บันทึกข้อมูลผู้ใช้ใหม่
  save(user: UserEntity): Promise<UserEntity>;

  // ค้นหาผู้ใช้โดยใช้ username
  findByUsername(username: string): Promise<UserEntity | null>;

  // เพิ่มเมธอดค้นหาด้วยอีเมล (ถ้าต้องการ)
  findByEmail?(email: string): Promise<UserEntity | null>;

  // อัปเดตข้อมูลของผู้ใช้
  update(user: UserEntity): Promise<UserEntity>;

  delete(id: string): Promise<void>;

  // นับจำนวนผู้ใช้ทั้งหมด
  count(): Promise<number>;

  findById(id: string): Promise<UserEntity | null>;

  findAllCountPaginated(
    page: number,
    limit: number,
    sortBy: string,
    sortType: string,
    keyword: string,
    isActive: boolean,
    roles: string,
    company: string,
  ): Promise<[UserEntity[], number]>;
}
