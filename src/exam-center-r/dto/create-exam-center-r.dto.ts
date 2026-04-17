import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateExamCenterRDto {
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
}