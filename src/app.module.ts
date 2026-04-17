// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CentersModule } from './centers/centers.module';
import { FaceTemplatesModule } from './face-templates/face-templates.module';
import { OperatorsModule } from './operators/operators.module';
import { ExamsModule } from './exams/exams.module';
import { ShiftsModule } from './shifts/shifts.module';
import { ExamCenterRModule } from './exam-center-r/exam-center-r.module';
import { CandidatesModule } from './candidates/candidates.module';
import { OperatorSessionsModule } from './operator-sessions/operator-sessions.module';
import { DevicesModule } from './devices/devices.module';
import { CandidateAttendanceModule } from './candidate-attendance/candidate-attendance.module';
import { GeoValidationLogsModule } from './geo-validation-logs/geo-validation-logs.module';
import { LivenessLogsModule } from './liveness-logs/liveness-logs.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [
  DbModule,
  UsersModule,
  AuthModule,
  CentersModule,
  FaceTemplatesModule,
  OperatorsModule,
  ExamsModule,
  ShiftsModule,
  ExamCenterRModule,
  CandidatesModule,
  OperatorSessionsModule,
  DevicesModule,
  CandidateAttendanceModule,
  GeoValidationLogsModule,
  LivenessLogsModule,
  AuditLogsModule,
],
})
export class AppModule {}