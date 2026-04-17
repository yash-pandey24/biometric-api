import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOperatorDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  template_id!: number;

  @ApiProperty({ example: 'OPR001' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  operator_code!: string;

  @ApiProperty({ example: 'Rahul' })
  @IsString()
  @MaxLength(100)
  first_name!: string;

  @ApiPropertyOptional({ example: 'Kumar' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  middle_name?: string;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  last_name?: string;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,20}$/, {
    message: 'mobile_number must contain only digits and be 10 to 20 characters long',
  })
  mobile_number?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  assigned_center_id!: number;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  created_by!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  updated_by!: string;
}