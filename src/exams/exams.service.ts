import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE_DB } from '../db/db.provider';
import { db } from '../db/db';
import { exams } from '../db/schema';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(createExamDto: CreateExamDto) {
    if (createExamDto.exam_end_date < createExamDto.exam_start_date) {
      throw new BadRequestException({
        success: false,
        message: 'exam_end_date cannot be earlier than exam_start_date',
      });
    }

    const existing = await this.drizzleDb
      .select()
      .from(exams)
      .where(eq(exams.examCode, createExamDto.exam_code));

    if (existing.length > 0) {
      throw new BadRequestException({
        success: false,
        message: 'Exam code already exists',
      });
    }

    try {
      await this.drizzleDb.insert(exams).values({
        examCode: createExamDto.exam_code,
        examName: createExamDto.exam_name,
        examType: createExamDto.exam_type ?? null,
        examStartDate: createExamDto.exam_start_date,
        examEndDate: createExamDto.exam_end_date,
        frRequired: createExamDto.fr_required ?? false,
        frType: createExamDto.fr_type ?? null,
        biometricRequired: createExamDto.biometric_required ?? false,
        geoFencingRequired: createExamDto.geo_fencing_required ?? false,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: createExamDto.created_by,
        updatedAt: new Date(),
        updatedBy: createExamDto.updated_by,
        mvcc: 1,
      });

      return {
        success: true,
        message: 'Exam created successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create exam',
      });
    }
  }

  async findAll() {
    const result = await this.drizzleDb
      .select({
        exam_id: exams.examId,
        exam_code: exams.examCode,
        exam_name: exams.examName,
        exam_type: exams.examType,
        exam_start_date: exams.examStartDate,
        exam_end_date: exams.examEndDate,
        fr_required: exams.frRequired,
        fr_type: exams.frType,
        biometric_required: exams.biometricRequired,
        geo_fencing_required: exams.geoFencingRequired,
        is_deleted: exams.isDeleted,
        created_at: exams.createdAt,
        updated_at: exams.updatedAt,
      })
      .from(exams)
      .where(eq(exams.isDeleted, false));

    return {
      success: true,
      message: 'Exams fetched successfully',
      data: result,
    };
  }

  async findOne(id: number) {
    const result = await this.drizzleDb
      .select({
        exam_id: exams.examId,
        exam_code: exams.examCode,
        exam_name: exams.examName,
        exam_type: exams.examType,
        exam_start_date: exams.examStartDate,
        exam_end_date: exams.examEndDate,
        fr_required: exams.frRequired,
        fr_type: exams.frType,
        biometric_required: exams.biometricRequired,
        geo_fencing_required: exams.geoFencingRequired,
        is_deleted: exams.isDeleted,
        created_at: exams.createdAt,
        updated_at: exams.updatedAt,
      })
      .from(exams)
      .where(and(eq(exams.examId, id), eq(exams.isDeleted, false)));

    if (result.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Exam not found',
      });
    }

    return {
      success: true,
      message: 'Exam fetched successfully',
      data: result[0],
    };
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const existing = await this.drizzleDb
      .select()
      .from(exams)
      .where(and(eq(exams.examId, id), eq(exams.isDeleted, false)));

    if (existing.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Exam not found',
      });
    }

    const nextStartDate = updateExamDto.exam_start_date ?? existing[0].examStartDate;
    const nextEndDate = updateExamDto.exam_end_date ?? existing[0].examEndDate;

    if (nextEndDate < nextStartDate) {
      throw new BadRequestException({
        success: false,
        message: 'exam_end_date cannot be earlier than exam_start_date',
      });
    }

    if (updateExamDto.exam_code) {
      const duplicate = await this.drizzleDb
        .select()
        .from(exams)
        .where(eq(exams.examCode, updateExamDto.exam_code));

      if (duplicate.length > 0 && duplicate[0].examId !== id) {
        throw new BadRequestException({
          success: false,
          message: 'Exam code already exists',
        });
      }
    }

    const payload: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: updateExamDto.updated_by ?? existing[0].updatedBy,
      mvcc: (existing[0].mvcc ?? 0) + 1,
    };

    if (updateExamDto.exam_code !== undefined) payload.examCode = updateExamDto.exam_code;
    if (updateExamDto.exam_name !== undefined) payload.examName = updateExamDto.exam_name;
    if (updateExamDto.exam_type !== undefined) payload.examType = updateExamDto.exam_type;
    if (updateExamDto.exam_start_date !== undefined) payload.examStartDate = updateExamDto.exam_start_date;
    if (updateExamDto.exam_end_date !== undefined) payload.examEndDate = updateExamDto.exam_end_date;
    if (updateExamDto.fr_required !== undefined) payload.frRequired = updateExamDto.fr_required;
    if (updateExamDto.fr_type !== undefined) payload.frType = updateExamDto.fr_type;
    if (updateExamDto.biometric_required !== undefined) payload.biometricRequired = updateExamDto.biometric_required;
    if (updateExamDto.geo_fencing_required !== undefined) payload.geoFencingRequired = updateExamDto.geo_fencing_required;

    try {
      await this.drizzleDb
        .update(exams)
        .set(payload)
        .where(eq(exams.examId, id));

      return {
        success: true,
        message: 'Exam updated successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update exam',
      });
    }
  }

  async remove(id: number) {
    const existing = await this.drizzleDb
      .select()
      .from(exams)
      .where(and(eq(exams.examId, id), eq(exams.isDeleted, false)));

    if (existing.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Exam not found',
      });
    }

    try {
      await this.drizzleDb
        .update(exams)
        .set({
          isDeleted: true,
          updatedAt: new Date(),
          mvcc: (existing[0].mvcc ?? 0) + 1,
        })
        .where(eq(exams.examId, id));

      return {
        success: true,
        message: 'Exam deleted successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete exam',
      });
    }
  }
}