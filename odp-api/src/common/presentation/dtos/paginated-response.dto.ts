import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'The list of items on the current page' })
  items: T[];

  @ApiProperty({ description: 'The total number of items' })
  totalItems: number;

  @ApiProperty({ description: 'The number of items per page' })
  itemsPerPage: number;

  @ApiProperty({ description: 'The total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'The current page number' })
  currentPage: number;

  constructor(
    items: T[],
    totalItems: number,
    itemsPerPage: number,
    currentPage: number,
  ) {
    this.items = items;
    this.totalItems = totalItems;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = currentPage;
    this.totalPages = Math.ceil(totalItems / itemsPerPage);
  }
}
