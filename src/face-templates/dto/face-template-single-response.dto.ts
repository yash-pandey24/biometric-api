import { ApiProperty } from '@nestjs/swagger';
import { FaceTemplateResponseDto } from './face-template-response.dto';

export class FaceTemplateSingleResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Face template fetched successfully' })
  message!: string;

  @ApiProperty({ type: FaceTemplateResponseDto })
  data!: FaceTemplateResponseDto;
}