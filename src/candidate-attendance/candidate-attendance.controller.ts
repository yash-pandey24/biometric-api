import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CandidateAttendanceService } from './candidate-attendance.service';
import { CreateCandidateAttendanceDto } from './dto/create-candidate-attendance.dto';
import { UpdateCandidateAttendanceDto } from './dto/update-candidate-attendance.dto';

@ApiTags('candidate_attendance')
@Controller('candidate-attendance')
export class CandidateAttendanceController {
  constructor(private readonly service: CandidateAttendanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create candidate attendance' })
  @ApiBody({ type: CreateCandidateAttendanceDto })
  @ApiResponse({ status: 201, description: 'Candidate attendance created successfully' })
  create(@Body() dto: CreateCandidateAttendanceDto) {
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

  @Patch(':id')
  @ApiBody({ type: UpdateCandidateAttendanceDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCandidateAttendanceDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}