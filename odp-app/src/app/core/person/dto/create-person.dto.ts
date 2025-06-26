export interface CreatePersonDto {
    n_id: string;
    name: string;
    surname: string;
    dob: string;
    gender: string;
    citizen: string;
    nationality: string;
    religion: string;
    phone: string;
    address: string;
    
    // เพิ่ม property อื่นๆ ตามที่ backend ต้องการได้ที่นี่
}