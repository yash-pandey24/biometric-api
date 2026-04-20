import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
@ApiTags('dashboard')
@Controller('dashboard/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get(':rollNumber')
  @ApiOperation({ summary: 'Get candidate attendance details' })
  getAttendanceDetails(@Param('rollNumber') rollNumber: string) {
    return this.attendanceService.getAttendanceDetails(rollNumber);
  }
}