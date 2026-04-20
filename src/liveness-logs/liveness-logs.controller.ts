import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LivenessLogsService } from './liveness-logs.service';
import { CreateLivenessLogDto } from './dto/create-liveness-log.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@ApiTags('liveness_logs')
@Controller('liveness-logs')
export class LivenessLogsController {
  constructor(private readonly service: LivenessLogsService) {}

  @Post()
  @ApiBody({ type: CreateLivenessLogDto })
  create(@Body() dto: CreateLivenessLogDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}