import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE_DB } from '../../db/db.provider';
import { db } from '../../db/db';
import { centers, candidates } from '../../db/schema';

@Injectable()
export class CenterService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async getCenterDetails(centerId: number) {
    const center = await this.drizzleDb
      .select()
      .from(centers)
      .where(and(eq(centers.centerId, centerId), eq(centers.isDeleted, false)));

    if (center.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Center not found',
      });
    }

    const candidateList = await this.drizzleDb
      .select({
        candidate_id: candidates.candidateId,
        roll_number: candidates.rollNumber,
        first_name: candidates.firstName,
        middle_name: candidates.middleName,
        last_name: candidates.lastName,
        exam_id: candidates.examId,
      })
      .from(candidates)
      .where(
        and(
          eq(candidates.assignedCenterId, centerId),
          eq(candidates.isDeleted, false),
        ),
      );

    const enrichedCandidates = candidateList.map((c) => {
      const candidate_name = [c.first_name, c.middle_name, c.last_name]
        .filter(Boolean)
        .join(' ');

      return {
        candidate_id: c.candidate_id,
        roll_number: c.roll_number,
        candidate_name,
        exam_id: c.exam_id,
        attendance_details_path: `/dashboard/attendance/${c.roll_number}`,
      };
    });

    return {
      success: true,
      message: 'Center details fetched successfully',
      data: {
        center: center[0],
        candidates: enrichedCandidates,
      },
    };
  }
}