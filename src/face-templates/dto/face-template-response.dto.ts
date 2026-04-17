import { ApiProperty } from '@nestjs/swagger';

export class FaceTemplateResponseDto {
  @ApiProperty({ example: 1 })
  template_id!: number;

  @ApiProperty({ example: 'dGVzdF90ZW1wbGF0ZV9kYXRh' })
  encrypted_template!: string;

  @ApiProperty({ example: 'v1', nullable: true })
  template_version!: string | null;

  @ApiProperty({ example: false })
  is_deleted!: boolean;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: 'admin_user' })
  created_by!: string;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z' })
  updated_at!: string;

  @ApiProperty({ example: 'admin_user' })
  updated_by!: string;

  @ApiProperty({ example: 1 })
  mvcc!: number;
}