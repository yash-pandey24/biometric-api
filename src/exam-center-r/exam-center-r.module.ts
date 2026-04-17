import { Module } from '@nestjs/common';
import { ExamCenterRController } from './exam-center-r.controller';
import { ExamCenterRService } from './exam-center-r.service';

@Module({
  controllers: [ExamCenterRController],
  providers: [ExamCenterRService],
})
export class ExamCenterRModule {}