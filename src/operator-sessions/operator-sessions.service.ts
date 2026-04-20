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
import {
  operatorSessions,
  operators,
  exams,
  centers,
  shifts,
  devices,
} from '../db/schema';
import { CreateOperatorSessionDto } from './dto/create-operator-session.dto';

@Injectable()
export class OperatorSessionsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(dto: CreateOperatorSessionDto) {
    const operator = await this.drizzleDb
      .select()
      .from(operators)
      .where(eq(operators.operatorId, dto.operator_id));

    if (!operator.length) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid operator_id',
      });
    }

    const exam = await this.drizzleDb
      .select()
      .from(exams)
      .where(and(eq(exams.examId, dto.exam_id), eq(exams.isDeleted, false)));

    if (!exam.length) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid exam_id',
      });
    }

    const center = await this.drizzleDb
      .select()
      .from(centers)
      .where(
        and(eq(centers.centerId, dto.center_id), eq(centers.isDeleted, false)),
      );

    if (!center.length) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid center_id',
      });
    }

    const shift = await this.drizzleDb
      .select()
      .from(shifts)
      .where(and(eq(shifts.shiftId, dto.shift_id), eq(shifts.isDeleted, false)));

    if (!shift.length) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid shift_id',
      });
    }

    const device = await this.drizzleDb
      .select()
      .from(devices)
      .where(eq(devices.deviceId, dto.device_id));

    if (!device.length) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid device_id',
      });
    }

    const activeSession = await this.drizzleDb
      .select()
      .from(operatorSessions)
      .where(
        and(
          eq(operatorSessions.operatorId, dto.operator_id),
          eq(operatorSessions.isActive, true),
          eq(operatorSessions.isDeleted, false),
        ),
      );

    if (activeSession.length > 0) {
      throw new BadRequestException({
        success: false,
        message: 'Operator already has an active session',
      });
    }

    try {
      await this.drizzleDb.insert(operatorSessions).values({
        operatorId: dto.operator_id,
        examId: dto.exam_id,
        centerId: dto.center_id,
        shiftId: dto.shift_id,
        deviceId: dto.device_id,
        sessionStart: new Date(),
        sessionEnd: null,
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: dto.created_by,
        updatedAt: new Date(),
        updatedBy: dto.updated_by,
        mvcc: 1,
      });

      return {
        success: true,
        message: 'Operator session started successfully',
      };
    } catch (error: any) {
      console.error('Operator session DB error:', error);

      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create operator session',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }

  async logout(operatorId: number) {
    const session = await this.drizzleDb
      .select()
      .from(operatorSessions)
      .where(
        and(
          eq(operatorSessions.operatorId, operatorId),
          eq(operatorSessions.isActive, true),
          eq(operatorSessions.isDeleted, false),
        ),
      );

    if (!session.length) {
      throw new NotFoundException({
        success: false,
        message: 'Active session not found',
      });
    }

    await this.drizzleDb
      .update(operatorSessions)
      .set({
        sessionEnd: new Date(),
        isActive: false,
        isDeleted: true,
        updatedAt: new Date(),
        mvcc: (session[0].mvcc ?? 0) + 1,
      })
      .where(eq(operatorSessions.sessionId, session[0].sessionId));

    return {
      success: true,
      message: 'Operator logged out successfully',
    };
  }
}