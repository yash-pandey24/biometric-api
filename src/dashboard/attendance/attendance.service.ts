import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE_DB } from '../../db/db.provider';
import { db } from '../../db/db';
import {
  candidates,
  candidateAttendance,
  operatorSessions,
  devices,
} from '../../db/schema';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async getAttendanceDetails(rollNumber: string) {
    const candidate = await this.drizzleDb
      .select()
      .from(candidates)
      .where(
        and(
          eq(candidates.rollNumber, rollNumber),
          eq(candidates.isDeleted, false),
        ),
      );

    if (candidate.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Candidate not found',
      });
    }

    const candidateData = candidate[0];

    const attendance = await this.drizzleDb
      .select()
      .from(candidateAttendance)
      .where(
        and(
          eq(candidateAttendance.candidateId, candidateData.candidateId),
          eq(candidateAttendance.isDeleted, false),
        ),
      );

    const sessions = await this.drizzleDb
      .select({
        session_id: operatorSessions.sessionId,
        device_id: operatorSessions.deviceId,
        login_time: operatorSessions.sessionStart,
        logout_time: operatorSessions.sessionEnd,
      })
      .from(operatorSessions)
      .where(
        and(
          eq(operatorSessions.examId, candidateData.examId),
          eq(operatorSessions.centerId, candidateData.assignedCenterId),
          eq(operatorSessions.isDeleted, false),
        ),
      );

    const deviceDetails = await this.drizzleDb
      .select()
      .from(devices)
      .where(
        and(
          eq(devices.centerId, candidateData.assignedCenterId),
          eq(devices.isDeleted, false),
        ),
      );

    return {
      success: true,
      message: 'Attendance details fetched successfully',
      data: {
        candidate: candidateData,
        attendance_records: attendance,
        operator_sessions: sessions,
        devices: deviceDetails,
      },
    };
  }
}