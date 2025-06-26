import { CreatePersonDto } from "./create-person.dto";

export interface UpdatePersonDto extends CreatePersonDto {
    // เพิ่ม property เพิ่มเติมสำหรับการแก้ไข (ถ้ามี)
}