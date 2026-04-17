import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserType {
  SUPER_ADMIN = 'SuperAdmin',
  EXAM_ADMIN = 'ExamAdmin',
  AUDITOR = 'Auditor',
}

export class CreateNewUserDto {
  @ApiProperty({ example: 'admin_yash_1' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  user_name!: string;

  @ApiProperty({ example: 'Admin@123' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string;

  @ApiProperty({ example: 'Yash Pandey Admin' })
  @IsString()
  @MaxLength(150)
  full_name!: string;

  @ApiPropertyOptional({ example: 'admin1@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ example: '9000000001' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  mobile_number?: string;

  @ApiProperty({ enum: UserType, example: UserType.SUPER_ADMIN })
  @IsEnum(UserType)
  user_type!: UserType;

  @ApiProperty({ example: 1 })
  @IsInt()
  created_by!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  updated_by!: number;
}