import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBase64, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFaceTemplateDto {
  @ApiProperty({
    example: 'dGVzdF90ZW1wbGF0ZV9kYXRh',
    description: 'Base64 encoded encrypted template',
  })
  @IsBase64()
  encrypted_template!: string;

  @ApiPropertyOptional({ example: 'v1' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  template_version?: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  created_by!: string;

  @ApiProperty({ example: 'admin_user' })
  @IsString()
  @MaxLength(100)
  updated_by!: string;
}