import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePersonDto {
  @ApiPropertyOptional({ description: 'National_ID' })
  @IsString()
  @IsOptional()
  n_id: string;

  @ApiPropertyOptional({ description: 'First Name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: 'Last Name' })
  @IsString()
  @IsOptional()
  surname: string;

  @ApiPropertyOptional({ description: 'date-of-birth' })
  @IsString()
  @IsOptional()
  dob: string;

  @ApiPropertyOptional({ description: 'Gender' })
  @IsString()
  @IsOptional()
  gender: string;

  @ApiPropertyOptional({ description: 'Citizenship' })
  @IsString()
  @IsOptional()
  citizen: string; // เชื้อชาติ

  @ApiPropertyOptional({ description: 'Nationality' })
  @IsString()
  @IsOptional()
  nationality: string; // สัญชาติ

  @ApiPropertyOptional({ description: 'Religion' })
  @IsString()
  @IsOptional()
  religion: string; // ศาสนา

  @ApiPropertyOptional({ description: 'Phone Number' })
  @IsString()
  @IsOptional()
  phone: string; // เบอร์โทร

  @ApiPropertyOptional({ description: 'Address' })
  @IsString()
  @IsOptional()
  address: string; // ที่อยู่
}