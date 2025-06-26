import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ description: 'Name of the member' })
  @IsString()
  name: string;

  companyId: string;
}