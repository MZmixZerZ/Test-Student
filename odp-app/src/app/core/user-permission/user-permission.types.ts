import { BaseInterface } from "../base/baseInterface.types";
import { Role } from "./enum/role.enum";
export interface UserPermission extends BaseInterface {
    username: string;
    email: string;
    phoneNumber: string;
    role?: Role;
    fullName?: string;
    isActive?: boolean,
}
