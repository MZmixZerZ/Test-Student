export interface Member
{
    id: string;
    memberId: string;        // <-- เพิ่มบรรทัดนี้
    idCard: string;
    organization: string;
    contactPerson: string;
    contactPhone: string;
    // ...field อื่นๆ ตาม backend
}
