import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExamService } from './exam.service';

@ApiTags('dashboard')
@Controller('dashboard/exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get(':examId')
  @ApiOperation({ summary: 'Get exam dashboard table data' })
  getExamTable(@Param('examId', ParseIntPipe) examId: number) {
    return this.examService.getExamTable(examId);
  }
}