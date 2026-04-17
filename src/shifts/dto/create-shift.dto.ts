import {
  IsDateString,
  IsInt,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShiftDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  exam_id!: number;

  @ApiProperty({ example: '2026-04-20' })
  @IsDateString()
  exam_date!: string;

  @ApiProperty({ example: 'Morning Shift' })
  @IsString()
  @MaxLength(50)
  shift_name!: string;

  @ApiProperty({ example: '09:00:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'start_time must be in HH:MM:SS format',
  })
  start_time!: string;

  @ApiProperty({ example: '12:00:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'end_time must be in HH:MM:SS format',
  })
  end_time!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  created_by!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  updated_by!: string;
}