import { Module } from '@nestjs/common';
import { DeletedService } from './deleted.service';
import {DeletedController} from './deleted.controller';

@Module({
  controllers: [DeletedController],
  providers: [DeletedService],
})
export class DeletedModule {}