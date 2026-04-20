import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CenterService } from './center.service';

@ApiTags('dashboard')
@Controller('dashboard/center')
export class CenterController {
  constructor(private readonly centerService: CenterService) {}

  @Get(':centerId')
  @ApiOperation({ summary: 'Get center details (drilldown)' })
  getCenterDetails(@Param('centerId', ParseIntPipe) centerId: number) {
    return this.centerService.getCenterDetails(centerId);
  }
}