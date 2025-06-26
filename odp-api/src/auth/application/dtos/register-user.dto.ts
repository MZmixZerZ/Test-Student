import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3)
  username: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
    message:
      'Password must be at least 6 characters long, contain at least one letter and one number',
  })
  password: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  //@ApiProperty({ description: 'Phone number of the user' })
  //@IsString()
  // @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @ApiProperty({ description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({ description: 'Company name of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  companyName: string;

  @ApiProperty({ description: 'Company registration number of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Company registration number is required' })
  companyRegisterNo: string;
}
