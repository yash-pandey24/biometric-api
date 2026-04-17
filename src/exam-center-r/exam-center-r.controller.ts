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
import { ExamCenterRService } from './exam-center-r.service';
import { CreateExamCenterRDto } from './dto/create-exam-center-r.dto';
import { UpdateExamCenterRDto } from './dto/update-exam-center-r.dto';

@ApiTags('exam_center_r')
@Controller('exam-center-r')
export class ExamCenterRController {
  constructor(private readonly service: ExamCenterRService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create exam-center-shift mapping' })
  @ApiBody({ type: CreateExamCenterRDto })
  @ApiResponse({ status: 201, description: 'Mapping created successfully' })
  create(@Body() dto: CreateExamCenterRDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exam-center-shift mappings' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam-center-shift mapping by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update exam-center-shift mapping by id' })
  @ApiBody({ type: UpdateExamCenterRDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExamCenterRDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exam-center-shift mapping by id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}