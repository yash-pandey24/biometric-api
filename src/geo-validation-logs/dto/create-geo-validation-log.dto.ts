import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGeoValidationLogDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  device_id!: number;

  @ApiPropertyOptional({ example: 'ATTENDANCE_CAPTURE' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  action_type?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  operator_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  candidate_id?: number;

  @ApiPropertyOptional({ example: 28.613939 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 77.209023 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 15.2 })
  @IsOptional()
  @IsNumber()
  distance_from_center_meters?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_valid?: boolean;

  @ApiPropertyOptional({ example: 'WITHIN_ALLOWED_RADIUS' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  reason_code?: string;
}