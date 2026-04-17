import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  center_id!: number;

  @ApiProperty({ example: 'DEVICE-001' })
  @IsString()
  @MaxLength(150)
  device_unique_id!: string;

  @ApiPropertyOptional({ example: '356938035643809' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9-]+$/, {
    message: 'imei can contain only letters, numbers, and hyphens',
  })
  imei?: string;

  @ApiProperty({ example: 'reg_token_abc_123' })
  @IsString()
  @MaxLength(500)
  registration_token!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  created_by!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  updated_by!: string;
}