import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ description: 'Member ID (unique/increment)', example: 'M0001' })
  @IsString()
  memberId: string;

  @ApiProperty({ description: 'ID Card', example: '1234567890123' })
  @IsString()
  idCard: string;

  @ApiProperty({ description: 'Organization', example: 'CS1001' })
  @IsString()
  organization: string;

  @ApiProperty({ description: 'Contact Person', example: 'John Doe' })
  @IsString()
  contactPerson: string;

  @ApiProperty({ description: 'Contact Phone', example: '0812345678' })
  @IsString()
  contactPhone: string;
}