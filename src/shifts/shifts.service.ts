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
import { exams, shifts } from '../db/schema';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(dto: CreateShiftDto) {
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

    if (dto.end_time <= dto.start_time) {
      throw new BadRequestException({
        success: false,
        message: 'end_time must be later than start_time',
      });
    }

    try {
      await this.drizzleDb.insert(shifts).values({
        examId: dto.exam_id,
        examDate: dto.exam_date,
        shiftName: dto.shift_name,
        startTime: dto.start_time,
        endTime: dto.end_time,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: dto.created_by,
        updatedAt: new Date(),
        updatedBy: dto.updated_by,
        mvcc: 1,
      });

      return {
        success: true,
        message: 'Shift created successfully',
      };
    } catch (error: any) {
      console.error('Create shift DB error:', error);

      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create shift',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }

  async findAll() {
    const data = await this.drizzleDb
      .select({
        shift_id: shifts.shiftId,
        exam_id: shifts.examId,
        exam_date: shifts.examDate,
        shift_name: shifts.shiftName,
        start_time: shifts.startTime,
        end_time: shifts.endTime,
        is_deleted: shifts.isDeleted,
        created_at: shifts.createdAt,
        created_by: shifts.createdBy,
        updated_at: shifts.updatedAt,
        updated_by: shifts.updatedBy,
        mvcc: shifts.mvcc,
      })
      .from(shifts)
      .where(eq(shifts.isDeleted, false));

    return {
      success: true,
      message: 'Shifts fetched successfully',
      data,
    };
  }

  async findOne(id: number) {
    const result = await this.drizzleDb
      .select({
        shift_id: shifts.shiftId,
        exam_id: shifts.examId,
        exam_date: shifts.examDate,
        shift_name: shifts.shiftName,
        start_time: shifts.startTime,
        end_time: shifts.endTime,
        is_deleted: shifts.isDeleted,
        created_at: shifts.createdAt,
        created_by: shifts.createdBy,
        updated_at: shifts.updatedAt,
        updated_by: shifts.updatedBy,
        mvcc: shifts.mvcc,
      })
      .from(shifts)
      .where(and(eq(shifts.shiftId, id), eq(shifts.isDeleted, false)));

    if (!result.length) {
      throw new NotFoundException({
        success: false,
        message: 'Shift not found',
      });
    }

    return {
      success: true,
      message: 'Shift fetched successfully',
      data: result[0],
    };
  }

  async update(id: number, dto: UpdateShiftDto) {
    const existing = await this.drizzleDb
      .select()
      .from(shifts)
      .where(and(eq(shifts.shiftId, id), eq(shifts.isDeleted, false)));

    if (!existing.length) {
      throw new NotFoundException({
        success: false,
        message: 'Shift not found',
      });
    }

    const nextStartTime = dto.start_time ?? existing[0].startTime;
    const nextEndTime = dto.end_time ?? existing[0].endTime;

    if (nextEndTime <= nextStartTime) {
      throw new BadRequestException({
        success: false,
        message: 'end_time must be later than start_time',
      });
    }

    if (dto.exam_id !== undefined) {
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
    }

    const payload: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: dto.updated_by ?? existing[0].updatedBy,
      mvcc: (existing[0].mvcc ?? 0) + 1,
    };

    if (dto.exam_id !== undefined) payload.examId = dto.exam_id;
    if (dto.exam_date !== undefined) payload.examDate = dto.exam_date;
    if (dto.shift_name !== undefined) payload.shiftName = dto.shift_name;
    if (dto.start_time !== undefined) payload.startTime = dto.start_time;
    if (dto.end_time !== undefined) payload.endTime = dto.end_time;

    await this.drizzleDb
      .update(shifts)
      .set(payload)
      .where(eq(shifts.shiftId, id));

    return {
      success: true,
      message: 'Shift updated successfully',
    };
  }

  async remove(id: number) {
    const existing = await this.drizzleDb
      .select()
      .from(shifts)
      .where(and(eq(shifts.shiftId, id), eq(shifts.isDeleted, false)));

    if (!existing.length) {
      throw new NotFoundException({
        success: false,
        message: 'Shift not found',
      });
    }

    await this.drizzleDb
      .update(shifts)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
        mvcc: (existing[0].mvcc ?? 0) + 1,
      })
      .where(eq(shifts.shiftId, id));

    return {
      success: true,
      message: 'Shift deleted successfully',
    };
  }
}