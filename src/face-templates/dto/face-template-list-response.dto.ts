import { ApiProperty } from '@nestjs/swagger';
import { FaceTemplateResponseDto } from './face-template-response.dto';

export class FaceTemplateListResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Face templates fetched successfully' })
  message!: string;

  @ApiProperty({ type: [FaceTemplateResponseDto] })
  data!: FaceTemplateResponseDto[];
}