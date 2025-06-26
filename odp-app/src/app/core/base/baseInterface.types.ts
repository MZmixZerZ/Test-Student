import { UserBy } from "./userBy.types";

export interface BaseInterface {
    id: string;
    __v?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: UserBy;
    updatedBy?: UserBy;
}
