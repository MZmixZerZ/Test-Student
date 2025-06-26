import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ description: 'The item' })
  item: T;

  constructor(
    item: T
  ) {
    this.item = item;
  }
}
