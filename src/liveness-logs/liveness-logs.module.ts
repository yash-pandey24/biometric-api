import { Module } from '@nestjs/common';
import { LivenessLogsController } from './liveness-logs.controller';
import { LivenessLogsService } from './liveness-logs.service';

@Module({
  controllers: [LivenessLogsController],
  providers: [LivenessLogsService],
})
export class LivenessLogsModule {}