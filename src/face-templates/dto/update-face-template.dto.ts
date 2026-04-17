import { PartialType } from '@nestjs/mapped-types';
import { CreateFaceTemplateDto } from './create-face-template.dto';

export class UpdateFaceTemplateDto extends PartialType(CreateFaceTemplateDto) {}