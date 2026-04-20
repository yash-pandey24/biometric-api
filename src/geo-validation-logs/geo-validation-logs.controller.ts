import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GeoValidationLogsService } from './geo-validation-logs.service';
import { CreateGeoValidationLogDto } from './dto/create-geo-validation-log.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@ApiTags('geo_validation_logs')
@Controller('geo-validation-logs')
export class GeoValidationLogsController {
  constructor(private readonly service: GeoValidationLogsService) {}

  @Post()
  @ApiBody({ type: CreateGeoValidationLogDto })
  create(@Body() dto: CreateGeoValidationLogDto) {
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