import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OperatorSessionsService } from './operator-sessions.service';
import { CreateOperatorSessionDto } from './dto/create-operator-session.dto';

@ApiTags('operator_sessions')
@Controller('operator-sessions')
export class OperatorSessionsController {
  constructor(private readonly service: OperatorSessionsService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start operator session' })
  login(@Body() dto: CreateOperatorSessionDto) {
    return this.service.create(dto);
  }

  @Delete('logout/:operatorId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete active operator session' })
  logout(@Param('operatorId', ParseIntPipe) operatorId: number) {
    return this.service.logout(operatorId);
  }
}