import { Module } from '@nestjs/common';
import { GeoValidationLogsController } from './geo-validation-logs.controller';
import { GeoValidationLogsService } from './geo-validation-logs.service';

@Module({
  controllers: [GeoValidationLogsController],
  providers: [GeoValidationLogsService],
})
export class GeoValidationLogsModule {}