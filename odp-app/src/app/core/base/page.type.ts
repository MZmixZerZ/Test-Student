export interface Page {
    page: number;
    limit: number;
    sortBy?: string;
    sortType?: SortType;
};

export enum SortType {
    asc = 'asc',
    desc = 'desc',
};

export const DEF_LIMIT = 10;
