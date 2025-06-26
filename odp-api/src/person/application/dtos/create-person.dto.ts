import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePersonDto {
  @ApiProperty({ description: 'National_ID' })
  @IsString()
  n_id: string;

  @ApiProperty({ description: 'First Name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Last Name' })
  @IsString()
  surname: string;

  @ApiProperty({ description: 'date-of-birth' })
  @IsString()
  dob: string;

  @ApiProperty({ description: 'Gender' })
  @IsString()
  gender: string;

  @ApiProperty({ description: 'Citizenship' })
  @IsString()
  citizen: string; // เชื้อชาติ

  @ApiProperty({ description: 'Nationality' })
  @IsString()
  nationality: string; // สัญชาติ

  @ApiProperty({ description: 'Religion' })
  @IsString()
  religion: string; // ศาสนา

  @ApiProperty({ description: 'Phone Number' })
  @IsString()
  phone: string; // เบอร์โทร

  @ApiProperty({ description: 'Address' })
  @IsString()
  address: string; // ที่อยู่
}