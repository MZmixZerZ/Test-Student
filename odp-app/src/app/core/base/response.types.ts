export interface Response<T> {
    succeeded: boolean;
    code: number;
    message?: string[];
    error?: string;
    data?: T;
    items?: T;
    item?: T;
}
