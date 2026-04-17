import { Module } from '@nestjs/common';
import { OperatorSessionsController } from './operator-sessions.controller';
import { OperatorSessionsService } from './operator-sessions.service';

@Module({
  controllers: [OperatorSessionsController],
  providers: [OperatorSessionsService],
})
export class OperatorSessionsModule {}