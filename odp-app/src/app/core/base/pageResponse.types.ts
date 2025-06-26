import { Response } from './response.types';

export interface PageResponse<T> extends Response<T> {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}
