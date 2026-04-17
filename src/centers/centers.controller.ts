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
import { CentersService } from './centers.service';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';

@ApiTags('centers')
@Controller('centers')
export class CentersController {
  constructor(private readonly centersService: CentersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new center' })
  @ApiBody({ type: CreateCenterDto })
  @ApiResponse({ status: 201, description: 'Center created successfully' })
  create(@Body() createCenterDto: CreateCenterDto) {
    return this.centersService.create(createCenterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all centers' })
  findAll() {
    return this.centersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get center by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.centersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update center by id' })
  @ApiBody({ type: UpdateCenterDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCenterDto: UpdateCenterDto,
  ) {
    return this.centersService.update(id, updateCenterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete center by id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.centersService.remove(id);
  }
}