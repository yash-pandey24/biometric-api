import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from './create-new-user.dto';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'updated_user_1' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  user_name?: string;

  @ApiPropertyOptional({ example: 'NewPass@123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password?: string;

  @ApiPropertyOptional({ example: 'Updated Full Name' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  full_name?: string;

  @ApiPropertyOptional({ example: 'updated@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ example: '9111111111' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  mobile_number?: string;

  @ApiPropertyOptional({ enum: UserType, example: UserType.EXAM_ADMIN })
  @IsOptional()
  @IsEnum(UserType)
  user_type?: UserType;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  updated_by?: number;
}