import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ExamModule } from './exam/exam.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { CenterModule } from './center/center.module';
import { AttendanceModule } from './attendance/attendance.module';
import { DeletedModule } from './deleted/deleted.module';
import { CsrModule } from './csr/csr.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [ExamModule, EnrollmentModule, CenterModule, AttendanceModule, DeletedModule, CsrModule]
})
export class DashboardModule {}
