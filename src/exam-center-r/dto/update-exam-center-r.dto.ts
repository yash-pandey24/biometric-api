import { PartialType } from '@nestjs/mapped-types';
import { CreateExamCenterRDto } from './create-exam-center-r.dto';

export class UpdateExamCenterRDto extends PartialType(CreateExamCenterRDto) {}