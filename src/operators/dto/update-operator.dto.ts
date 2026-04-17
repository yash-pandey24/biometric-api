import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOperatorDto } from './create-operator.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOperatorDto extends PartialType(CreateOperatorDto) {
  @ApiPropertyOptional({ example: 'updated_admin' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  updated_by?: string;
}
