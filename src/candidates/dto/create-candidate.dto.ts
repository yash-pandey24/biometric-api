import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCandidateDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  exam_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  template_id!: number;

  @ApiProperty({ example: 'ROLL001' })
  @IsString()
  @MaxLength(100)
  roll_number!: string;

  @ApiPropertyOptional({ example: 'REG001' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  registration_number?: string;

  @ApiProperty({ example: 'Amit' })
  @IsString()
  @MaxLength(100)
  first_name!: string;

  @ApiPropertyOptional({ example: 'Kumar' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  middle_name?: string;

  @ApiPropertyOptional({ example: 'Singh' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  last_name?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  assigned_center_id!: number;

  @ApiProperty({ example: '2026-04-20' })
  @IsDateString()
  exam_date!: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_walkin_candidate?: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  exam_center_r_id!: number;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  created_by!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  updated_by!: string;
}