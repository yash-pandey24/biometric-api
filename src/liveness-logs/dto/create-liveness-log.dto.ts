import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLivenessLogDto {
  @ApiPropertyOptional({ example: 'candidate' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  entity_type?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  entity_id?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  device_id!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_liveness_passed!: boolean;

  @ApiPropertyOptional({ example: 'Face not detected clearly' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  failure_reason?: string;
}