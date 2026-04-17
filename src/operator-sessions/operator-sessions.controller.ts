import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { OperatorSessionsService } from './operator-sessions.service';
import { CreateOperatorSessionDto } from './dto/create-operator-session.dto';

@ApiTags('operator_sessions')
@Controller('operator-sessions')
export class OperatorSessionsController {
  constructor(private readonly service: OperatorSessionsService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Body() dto: CreateOperatorSessionDto) {
    return this.service.create(dto);
  }

  @Post('logout/:operatorId')
  logout(@Param('operatorId', ParseIntPipe) operatorId: number) {
    return this.service.logout(operatorId);
  }
}