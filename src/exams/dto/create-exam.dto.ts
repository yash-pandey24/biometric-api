import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExamType {
  CBT = 'CBT',
  OMR = 'OMR',
  TABLET = 'TABLET',
}

export class CreateExamDto {
  @ApiProperty({ example: 'EXAM001' })
  @IsString()
  @MaxLength(100)
  exam_code!: string;

  @ApiProperty({ example: 'Biometric Certification Test' })
  @IsString()
  @MaxLength(200)
  exam_name!: string;

  @ApiPropertyOptional({ enum: ExamType, example: ExamType.CBT })
  @IsOptional()
  @IsEnum(ExamType)
  exam_type?: ExamType;

  @ApiProperty({ example: '2026-04-20' })
  @IsDateString()
  exam_start_date!: string;

  @ApiProperty({ example: '2026-04-22' })
  @IsDateString()
  exam_end_date!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  fr_required?: boolean;

  @ApiPropertyOptional({ example: 'FACE_MATCH' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fr_type?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  biometric_required?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  geo_fencing_required?: boolean;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  created_by!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  updated_by!: string;
}