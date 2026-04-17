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
import { FaceTemplatesService } from './face-templates.service';
import { CreateFaceTemplateDto } from './dto/create-face-template.dto';
import { UpdateFaceTemplateDto } from './dto/update-face-template.dto';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

import { FaceTemplateListResponseDto } from './dto/face-template-list-response.dto';
import { FaceTemplateSingleResponseDto } from './dto/face-template-single-response.dto';

@ApiTags('face_templates')
@Controller('face-templates')
export class FaceTemplatesController {
  constructor(private readonly faceTemplatesService: FaceTemplatesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Face template created successfully',
    schema: {
      example: {
        success: true,
        message: 'Face template created successfully',
      },
    },
  })
  create(@Body() dto: CreateFaceTemplateDto) {
    return this.faceTemplatesService.create(dto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Get all face templates',
    type: FaceTemplateListResponseDto,
  })
  findAll() {
    return this.faceTemplatesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get face template by id',
    type: FaceTemplateSingleResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faceTemplatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update face template by id' })
  @ApiBody({ type: UpdateFaceTemplateDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFaceTemplateDto: UpdateFaceTemplateDto,
  ) {
    return this.faceTemplatesService.update(id, updateFaceTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete face template by id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.faceTemplatesService.remove(id);
  }
}