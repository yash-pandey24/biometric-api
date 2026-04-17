import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAuditLogDto {
  @ApiPropertyOptional({ example: 'CREATE_USER' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  action_type?: string;

  @ApiPropertyOptional({ example: 'users' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  entity_name?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  entity_id?: number;

  @ApiPropertyOptional({ example: 'admin_user' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  performed_by?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  device_id?: number;

  @ApiPropertyOptional({ example: '192.168.1.10' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ip_address?: string;
}