import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCandidateAttendanceDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  candidate_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  exam_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  operator_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  device_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  center_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  shift_id!: number;

  @ApiProperty({ example: 28.613939 })
  @IsNumber()
  latitude!: number;

  @ApiProperty({ example: 77.209023 })
  @IsNumber()
  longitude!: number;

  @ApiProperty({ example: 92.55 })
  @IsNumber()
  @Min(0)
  @Max(100)
  match_confidence!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_geo_valid!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_face_match!: boolean;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  created_by!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  updated_by!: string;
}