import { Role } from "../enum/role.enum";

export interface CreateUserPermissionDto {
    username: string;
    password?: string;
    email: string;
    phoneNumber: string;
    role: Role[];
    firstName: string;
    lastName: string;
    isActive: boolean;
}
