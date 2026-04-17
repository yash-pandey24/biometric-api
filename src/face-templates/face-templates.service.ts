import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE_DB } from '../db/db.provider';
import { db } from '../db/db';
import { faceTemplates } from '../db/schema';
import { CreateFaceTemplateDto } from './dto/create-face-template.dto';
import { UpdateFaceTemplateDto } from './dto/update-face-template.dto';

@Injectable()
export class FaceTemplatesService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(dto: CreateFaceTemplateDto) {
    try {
      await this.drizzleDb.insert(faceTemplates).values({
        encryptedTemplate: Buffer.from(dto.encrypted_template, 'base64'),
        templateVersion: dto.template_version ?? null,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: dto.created_by,
        updatedAt: new Date(),
        updatedBy: dto.updated_by,
        mvcc: 1,
      });

      return {
        success: true,
        message: 'Face template created successfully',
      };
    } catch (error: any) {
      console.error('Create face template DB error:', error);

      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create face template',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }

  async findAll() {
    const result = await this.drizzleDb
      .select({
        template_id: faceTemplates.templateId,
        template_version: faceTemplates.templateVersion,
        is_deleted: faceTemplates.isDeleted,
        created_at: faceTemplates.createdAt,
        created_by: faceTemplates.createdBy,
        updated_at: faceTemplates.updatedAt,
        updated_by: faceTemplates.updatedBy,
        mvcc: faceTemplates.mvcc,
      })
      .from(faceTemplates)
      .where(eq(faceTemplates.isDeleted, false));

    return {
      success: true,
      message: 'Face templates fetched successfully',
      data: result,
    };
  }

  async findOne(id: number) {
    const result = await this.drizzleDb
      .select({
        template_id: faceTemplates.templateId,
        template_version: faceTemplates.templateVersion,
        is_deleted: faceTemplates.isDeleted,
        created_at: faceTemplates.createdAt,
        created_by: faceTemplates.createdBy,
        updated_at: faceTemplates.updatedAt,
        updated_by: faceTemplates.updatedBy,
        mvcc: faceTemplates.mvcc,
      })
      .from(faceTemplates)
      .where(
        and(eq(faceTemplates.templateId, id), eq(faceTemplates.isDeleted, false)),
      );

    if (result.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Face template not found',
      });
    }

    return {
      success: true,
      message: 'Face template fetched successfully',
      data: result[0],
    };
  }

  async update(id: number, updateFaceTemplateDto: UpdateFaceTemplateDto) {
    const existing = await this.drizzleDb
      .select()
      .from(faceTemplates)
      .where(
        and(eq(faceTemplates.templateId, id), eq(faceTemplates.isDeleted, false)),
      );

    if (existing.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Face template not found',
      });
    }

    const payload: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: updateFaceTemplateDto.updated_by ?? existing[0].updatedBy,
      mvcc: (existing[0].mvcc ?? 0) + 1,
    };

    if (updateFaceTemplateDto.encrypted_template !== undefined) {
      payload.encryptedTemplate = Buffer.from(
        updateFaceTemplateDto.encrypted_template,
        'base64',
      );
    }

    if (updateFaceTemplateDto.template_version !== undefined) {
      payload.templateVersion = updateFaceTemplateDto.template_version;
    }

    try {
      await this.drizzleDb
        .update(faceTemplates)
        .set(payload)
        .where(eq(faceTemplates.templateId, id));

      return {
        success: true,
        message: 'Face template updated successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update face template',
      });
    }
  }

  async remove(id: number) {
    const existing = await this.drizzleDb
      .select()
      .from(faceTemplates)
      .where(
        and(eq(faceTemplates.templateId, id), eq(faceTemplates.isDeleted, false)),
      );

    if (existing.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Face template not found',
      });
    }

    try {
      await this.drizzleDb
        .update(faceTemplates)
        .set({
          isDeleted: true,
          updatedAt: new Date(),
          mvcc: (existing[0].mvcc ?? 0) + 1,
        })
        .where(eq(faceTemplates.templateId, id));

      return {
        success: true,
        message: 'Face template deleted successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete face template',
      });
    }
  }
}