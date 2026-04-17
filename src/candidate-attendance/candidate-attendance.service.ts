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
  candidateAttendance,
  candidates,
  centers,
  devices,
  examCenterR,
  exams,
  operators,
  shifts,
} from '../db/schema';
import { CreateCandidateAttendanceDto } from './dto/create-candidate-attendance.dto';
import { UpdateCandidateAttendanceDto } from './dto/update-candidate-attendance.dto';

@Injectable()
export class CandidateAttendanceService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  private async validateRefs(dto: {
    candidate_id: number;
    exam_id: number;
    operator_id: number;
    device_id: number;
    center_id: number;
    shift_id: number;
  }) {
    const candidate = await this.drizzleDb
      .select()
      .from(candidates)
      .where(
        and(
          eq(candidates.candidateId, dto.candidate_id),
          eq(candidates.isDeleted, false),
        ),
      );

    if (!candidate.length) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid candidate_id',
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

    const operator = await this.drizzleDb
      .select()
      .from(operators)
      .where(
        and(
          eq(operators.operatorId, dto.operator_id),
          eq(operators.isDeleted, false),
        ),
      );

    if (!operator.length) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid operator_id',
      });
    }

    const device = await this.drizzleDb
      .select()
      .from(devices)
      .where(
        and(eq(devices.deviceId, dto.device_id), eq(devices.isDeleted, false)),
      );

    if (!device.length) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid device_id',
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

    if (candidate[0].examId !== dto.exam_id) {
      throw new BadRequestException({
        success: false,
        message: 'candidate_id does not belong to the given exam_id',
      });
    }

    if (candidate[0].assignedCenterId !== dto.center_id) {
      throw new BadRequestException({
        success: false,
        message: 'candidate_id does not belong to the given center_id',
      });
    }

    const candidateMapping = await this.drizzleDb
      .select()
      .from(examCenterR)
      .where(eq(examCenterR.examCenterRId, candidate[0].examCenterRId));

    if (!candidateMapping.length) {
      throw new BadRequestException({
        success: false,
        message: 'Candidate has invalid exam_center_r_id mapping',
      });
    }

    if (candidateMapping[0].shiftId !== dto.shift_id) {
      throw new BadRequestException({
        success: false,
        message: 'candidate_id does not belong to the given shift_id',
      });
    }

    if (device[0].centerId !== dto.center_id) {
      throw new BadRequestException({
        success: false,
        message: 'device_id does not belong to the given center_id',
      });
    }
  }

  async create(dto: CreateCandidateAttendanceDto) {
    await this.validateRefs(dto);

    try {
      await this.drizzleDb.insert(candidateAttendance).values({
        candidateId: dto.candidate_id,
        examId: dto.exam_id,
        operatorId: dto.operator_id,
        deviceId: dto.device_id,
        centerId: dto.center_id,
        shiftId: dto.shift_id,
        attendanceTime: new Date(),
        latitude: String(dto.latitude),
        longitude: String(dto.longitude),
        matchConfidence: String(dto.match_confidence),
        isGeoValid: dto.is_geo_valid,
        isFaceMatch: dto.is_face_match,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: dto.created_by,
        updatedAt: new Date(),
        updatedBy: dto.updated_by,
        mvcc: 1,
      });

      return {
        success: true,
        message: 'Candidate attendance created successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create candidate attendance',
        detail: error?.message,
      });
    }
  }

  async findAll() {
    const data = await this.drizzleDb
      .select()
      .from(candidateAttendance)
      .where(eq(candidateAttendance.isDeleted, false));

    return {
      success: true,
      message: 'Candidate attendance fetched successfully',
      data,
    };
  }

  async findOne(id: number) {
    const result = await this.drizzleDb
      .select()
      .from(candidateAttendance)
      .where(
        and(
          eq(candidateAttendance.attendanceId, id),
          eq(candidateAttendance.isDeleted, false),
        ),
      );

    if (!result.length) {
      throw new NotFoundException({
        success: false,
        message: 'Candidate attendance not found',
      });
    }

    return {
      success: true,
      message: 'Candidate attendance fetched successfully',
      data: result[0],
    };
  }

  async update(id: number, dto: UpdateCandidateAttendanceDto) {
    const existing = await this.drizzleDb
      .select()
      .from(candidateAttendance)
      .where(
        and(
          eq(candidateAttendance.attendanceId, id),
          eq(candidateAttendance.isDeleted, false),
        ),
      );

    if (!existing.length) {
      throw new NotFoundException({
        success: false,
        message: 'Candidate attendance not found',
      });
    }

    const payload: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: dto.updated_by ?? existing[0].updatedBy,
      mvcc: (existing[0].mvcc ?? 0) + 1,
    };

    if (dto.latitude !== undefined) payload.latitude = String(dto.latitude);
    if (dto.longitude !== undefined) payload.longitude = String(dto.longitude);
    if (dto.match_confidence !== undefined) {
      payload.matchConfidence = String(dto.match_confidence);
    }
    if (dto.is_geo_valid !== undefined) payload.isGeoValid = dto.is_geo_valid;
    if (dto.is_face_match !== undefined) payload.isFaceMatch = dto.is_face_match;

    await this.drizzleDb
      .update(candidateAttendance)
      .set(payload)
      .where(eq(candidateAttendance.attendanceId, id));

    return {
      success: true,
      message: 'Candidate attendance updated successfully',
    };
  }

  async remove(id: number) {
    const existing = await this.drizzleDb
      .select()
      .from(candidateAttendance)
      .where(
        and(
          eq(candidateAttendance.attendanceId, id),
          eq(candidateAttendance.isDeleted, false),
        ),
      );

    if (!existing.length) {
      throw new NotFoundException({
        success: false,
        message: 'Candidate attendance not found',
      });
    }

    await this.drizzleDb
      .update(candidateAttendance)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
        mvcc: (existing[0].mvcc ?? 0) + 1,
      })
      .where(eq(candidateAttendance.attendanceId, id));

    return {
      success: true,
      message: 'Candidate attendance deleted successfully',
    };
  }
}