import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateOperatorSessionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  operator_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  exam_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  center_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  shift_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  device_id!: number;   // 🔥 NEW REQUIRED FIELD

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  created_by!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  updated_by!: string;
}