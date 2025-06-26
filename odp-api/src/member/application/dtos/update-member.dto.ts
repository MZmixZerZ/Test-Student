import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

export class UpdateMemberDto {
  @ApiPropertyOptional({ description: 'Name of the member' })
  @IsString()
  @IsOptional()
  name: string;

  companyId: string;
}
