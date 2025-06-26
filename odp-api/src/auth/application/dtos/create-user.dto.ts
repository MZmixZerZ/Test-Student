import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEnum(Role, {
    each: true,
  })
  @ApiProperty({
    description: 'Role assigned to the user',
    enum: Role,
  })
  role: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  email: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fullName: string;

  companyId: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isActive: boolean;
}
