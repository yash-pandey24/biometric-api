import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateAttendanceDto } from './create-candidate-attendance.dto';

export class UpdateCandidateAttendanceDto extends PartialType(
  CreateCandidateAttendanceDto,
) {}