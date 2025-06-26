import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({ description: 'Name of the company' })
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  logoUrl: string;

  @ApiPropertyOptional({ description: 'Short name of the company' })
  @IsString()
  @IsOptional()
  companyShortName: string;

  @ApiPropertyOptional({ description: 'Tax ID of the company' })
  @IsString()
  @IsOptional()
  taxId: string;

  @ApiPropertyOptional({ description: 'Address of the company' })
  @IsString()
  @IsOptional()
  address: string;
}
