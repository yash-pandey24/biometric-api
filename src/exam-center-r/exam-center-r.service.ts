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
import { centers, examCenterR, exams, shifts } from '../db/schema';
import { CreateExamCenterRDto } from './dto/create-exam-center-r.dto';
import { UpdateExamCenterRDto } from './dto/update-exam-center-r.dto';

@Injectable()
export class ExamCenterRService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(dto: CreateExamCenterRDto) {
    const exam = await this.drizzleDb
      .select()
      .from(exams)
      .where(and(eq(exams.examId, dto.exam_id), eq(exams.isDeleted, false)));

    if (exam.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid exam_id',
      });
    }

    const center = await this.drizzleDb
      .select()
      .from(centers)
      .where(and(eq(centers.centerId, dto.center_id), eq(centers.isDeleted, false)));

    if (center.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid center_id',
      });
    }

    const shift = await this.drizzleDb
      .select()
      .from(shifts)
      .where(and(eq(shifts.shiftId, dto.shift_id), eq(shifts.isDeleted, false)));

    if (shift.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid shift_id',
      });
    }

    if (shift[0].examId !== dto.exam_id) {
      throw new BadRequestException({
        success: false,
        message: 'shift_id does not belong to the given exam_id',
      });
    }

    const existing = await this.drizzleDb
      .select()
      .from(examCenterR)
      .where(
        and(
          eq(examCenterR.examId, dto.exam_id),
          eq(examCenterR.centerId, dto.center_id),
          eq(examCenterR.shiftId, dto.shift_id),
        ),
      );

    if (existing.length > 0) {
      throw new BadRequestException({
        success: false,
        message: 'This exam-center-shift combination already exists',
      });
    }

    try {
      await this.drizzleDb.insert(examCenterR).values({
        examId: dto.exam_id,
        centerId: dto.center_id,
        shiftId: dto.shift_id,
      });

      return {
        success: true,
        message: 'Exam-center-shift mapping created successfully',
      };
    } catch (error: any) {
      console.error('Create exam_center_r DB error:', error);

      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create exam-center-shift mapping',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }

  async findAll() {
    const data = await this.drizzleDb.select().from(examCenterR);

    return {
      success: true,
      message: 'Exam-center-shift mappings fetched successfully',
      data,
    };
  }

  async findOne(id: number) {
    const result = await this.drizzleDb
      .select()
      .from(examCenterR)
      .where(eq(examCenterR.examCenterRId, id));

    if (!result.length) {
      throw new NotFoundException({
        success: false,
        message: 'Exam-center-shift mapping not found',
      });
    }

    return {
      success: true,
      message: 'Exam-center-shift mapping fetched successfully',
      data: result[0],
    };
  }

  async update(id: number, dto: UpdateExamCenterRDto) {
    const existing = await this.drizzleDb
      .select()
      .from(examCenterR)
      .where(eq(examCenterR.examCenterRId, id));

    if (!existing.length) {
      throw new NotFoundException({
        success: false,
        message: 'Exam-center-shift mapping not found',
      });
    }

    const nextExamId = dto.exam_id ?? existing[0].examId;
    const nextCenterId = dto.center_id ?? existing[0].centerId;
    const nextShiftId = dto.shift_id ?? existing[0].shiftId;

    const exam = await this.drizzleDb
      .select()
      .from(exams)
      .where(and(eq(exams.examId, nextExamId), eq(exams.isDeleted, false)));

    if (exam.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid exam_id',
      });
    }

    const center = await this.drizzleDb
      .select()
      .from(centers)
      .where(and(eq(centers.centerId, nextCenterId), eq(centers.isDeleted, false)));

    if (center.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid center_id',
      });
    }

    const shift = await this.drizzleDb
      .select()
      .from(shifts)
      .where(and(eq(shifts.shiftId, nextShiftId), eq(shifts.isDeleted, false)));

    if (shift.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid shift_id',
      });
    }

    if (shift[0].examId !== nextExamId) {
      throw new BadRequestException({
        success: false,
        message: 'shift_id does not belong to the given exam_id',
      });
    }

    const duplicate = await this.drizzleDb
      .select()
      .from(examCenterR)
      .where(
        and(
          eq(examCenterR.examId, nextExamId),
          eq(examCenterR.centerId, nextCenterId),
          eq(examCenterR.shiftId, nextShiftId),
        ),
      );

    if (duplicate.length > 0 && duplicate[0].examCenterRId !== id) {
      throw new BadRequestException({
        success: false,
        message: 'This exam-center-shift combination already exists',
      });
    }

    try {
      await this.drizzleDb
        .update(examCenterR)
        .set({
          examId: nextExamId,
          centerId: nextCenterId,
          shiftId: nextShiftId,
        })
        .where(eq(examCenterR.examCenterRId, id));

      return {
        success: true,
        message: 'Exam-center-shift mapping updated successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update exam-center-shift mapping',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }

  async remove(id: number) {
    const existing = await this.drizzleDb
      .select()
      .from(examCenterR)
      .where(eq(examCenterR.examCenterRId, id));

    if (!existing.length) {
      throw new NotFoundException({
        success: false,
        message: 'Exam-center-shift mapping not found',
      });
    }

    try {
      await this.drizzleDb
        .delete(examCenterR)
        .where(eq(examCenterR.examCenterRId, id));

      return {
        success: true,
        message: 'Exam-center-shift mapping deleted successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete exam-center-shift mapping',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }
}