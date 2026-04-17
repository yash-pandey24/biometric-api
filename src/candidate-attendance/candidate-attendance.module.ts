import { Module } from '@nestjs/common';
import { CandidateAttendanceController } from './candidate-attendance.controller';
import { CandidateAttendanceService } from './candidate-attendance.service';

@Module({
  controllers: [CandidateAttendanceController],
  providers: [CandidateAttendanceService],
})
export class CandidateAttendanceModule {}