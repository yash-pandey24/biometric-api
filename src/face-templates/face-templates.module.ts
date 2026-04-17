import { Module } from '@nestjs/common';
import { FaceTemplatesController } from './face-templates.controller';
import { FaceTemplatesService } from './face-templates.service';

@Module({
  controllers: [FaceTemplatesController],
  providers: [FaceTemplatesService],
})
export class FaceTemplatesModule {}