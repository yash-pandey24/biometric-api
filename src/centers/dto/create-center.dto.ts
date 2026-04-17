import {
  IsLatitude,
  IsLongitude,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCenterDto {
  @ApiProperty({ example: 'CTR001' })
  @IsString()
  @MaxLength(50)
  center_code!: string;

  @ApiProperty({ example: 'Main Test Center' })
  @IsString()
  @MaxLength(150)
  center_name!: string;

  @ApiProperty({ example: '123 MG Road' })
  @IsString()
  @MaxLength(255)
  address_line1!: string;

  @ApiPropertyOptional({ example: 'Near Metro Station' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address_line2?: string;

  @ApiProperty({ example: 'Delhi' })
  @IsString()
  @MaxLength(100)
  city!: string;

  @ApiProperty({ example: 'Delhi' })
  @IsString()
  @MaxLength(100)
  state!: string;

  @ApiProperty({ example: '110001' })
  @IsString()
  @MaxLength(20)
  postal_code!: string;

  @ApiProperty({ example: 28.613939 })
  @IsLatitude()
  latitude!: number;

  @ApiProperty({ example: 77.209023 })
  @IsLongitude()
  longitude!: number;

  @ApiProperty({ example: 200 })
  @IsInt()
  @Min(1)
  allowed_radius_meters!: number;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  created_by!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  updated_by!: string;
}