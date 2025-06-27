import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateMemberDto {
  @ApiPropertyOptional({ description: 'Member ID (unique/increment)', example: 'M0001' })
  @IsString()
  @IsOptional()
  memberId?: string;

  @ApiPropertyOptional({ description: 'ID Card', example: '1234567890123' })
  @IsString()
  @IsOptional()
  idCard?: string;

  @ApiPropertyOptional({ description: 'Organization', example: 'CS1001' })
  @IsString()
  @IsOptional()
  organization?: string;

  @ApiPropertyOptional({ description: 'Contact Person', example: 'John Doe' })
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @ApiPropertyOptional({ description: 'Contact Phone', example: '0812345678' })
  @IsString()
  @IsOptional()
  contactPhone?: string;
}
