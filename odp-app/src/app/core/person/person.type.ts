export interface Person
{
    id: string;
    n_id: string;
    name: string;        // ชื่อจริง หรือ firstname
    surname: string;     // นามสกุล
    dob: string;
    gender: string;
    citizen: string;     // เชื้อชาติ
    nationality: string; // สัญชาติ
    religion: string;    // ศาสนา
    phone: string;       // เบอร์โทร
    address: string;     // ที่อยู่
    // เพิ่ม property อื่นๆ ตามที่ backend
}
