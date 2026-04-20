import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { DRIZZLE_DB } from '../../db/db.provider';
import { db } from '../../db/db';
import {
  candidateAttendance,
  candidates,
  centers,
  devices,
  examCenterR,
  exams,
  operatorSessions,
} from '../../db/schema';

@Injectable()
export class ExamService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async getExamTable(examId: number) {
    const examResult = await this.drizzleDb
      .select({
        exam_id: exams.examId,
        exam_code: exams.examCode,
        exam_name: exams.examName,
      })
      .from(exams)
      .where(and(eq(exams.examId, examId), eq(exams.isDeleted, false)));

    if (examResult.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Exam not found',
      });
    }

    const examCenters = await this.drizzleDb
      .select({
        center_id: centers.centerId,
        center_code: centers.centerCode,
        center_name: centers.centerName,
        center_city: centers.city,
      })
      .from(examCenterR)
      .innerJoin(centers, eq(examCenterR.centerId, centers.centerId))
      .where(
        and(
          eq(examCenterR.examId, examId),
          eq(centers.isDeleted, false),
        ),
      );

    const uniqueCentersMap = new Map<
      number,
      {
        center_id: number;
        center_code: string;
        center_name: string;
        center_city: string;
      }
    >();

    for (const row of examCenters) {
      if (!uniqueCentersMap.has(row.center_id)) {
        uniqueCentersMap.set(row.center_id, row);
      }
    }

    const uniqueCenters = Array.from(uniqueCentersMap.values());

    const rows = await Promise.all(
      uniqueCenters.map(async (center) => {
        const [deviceCountResult] = await this.drizzleDb
          .select({
            count: sql<number>`count(*)`,
          })
          .from(devices)
          .where(
            and(
              eq(devices.centerId, center.center_id),
              eq(devices.isDeleted, false),
            ),
          );

        const [assignedStudentsResult] = await this.drizzleDb
          .select({
            count: sql<number>`count(*)`,
          })
          .from(candidates)
          .where(
            and(
              eq(candidates.examId, examId),
              eq(candidates.assignedCenterId, center.center_id),
              eq(candidates.isDeleted, false),
            ),
          );

        const [walkInCountResult] = await this.drizzleDb
          .select({
            count: sql<number>`count(*)`,
          })
          .from(candidates)
          .where(
            and(
              eq(candidates.examId, examId),
              eq(candidates.assignedCenterId, center.center_id),
              eq(candidates.isWalkinCandidate, true),
              eq(candidates.isDeleted, false),
            ),
          );

        const [enrolledStudentsResult] = await this.drizzleDb
          .select({
            count: sql<number>`count(distinct ${candidateAttendance.candidateId})`,
          })
          .from(candidateAttendance)
          .where(
            and(
              eq(candidateAttendance.examId, examId),
              eq(candidateAttendance.centerId, center.center_id),
              eq(candidateAttendance.isDeleted, false),
            ),
          );

        const [faceRecognitionCountResult] = await this.drizzleDb
          .select({
            count: sql<number>`count(distinct ${candidateAttendance.candidateId})`,
          })
          .from(candidateAttendance)
          .where(
            and(
              eq(candidateAttendance.examId, examId),
              eq(candidateAttendance.centerId, center.center_id),
              eq(candidateAttendance.isFaceMatch, true),
              eq(candidateAttendance.isDeleted, false),
            ),
          );

        const duplicateResult = await this.drizzleDb
          .select({
            candidate_id: candidateAttendance.candidateId,
            count: sql<number>`count(*)`,
          })
          .from(candidateAttendance)
          .where(
            and(
              eq(candidateAttendance.examId, examId),
              eq(candidateAttendance.centerId, center.center_id),
              eq(candidateAttendance.isDeleted, false),
            ),
          )
          .groupBy(candidateAttendance.candidateId);

        const duplicateDataCount = duplicateResult.filter(
          (row) => Number(row.count) > 1,
        ).length;

        const [downloadedDevicesResult] = await this.drizzleDb
          .select({
            count: sql<number>`count(distinct ${operatorSessions.deviceId})`,
          })
          .from(operatorSessions)
          .where(
            and(
              eq(operatorSessions.examId, examId),
              eq(operatorSessions.centerId, center.center_id),
              eq(operatorSessions.isDeleted, false),
            ),
          );

        return {
          center_id: center.center_id,
          center_code: center.center_code,
          center_details_path: `/dashboard/center/${center.center_id}`,
          center_city: center.center_city,
          center_name: center.center_name,
          relationship_manager_name: null,
          total_students_assigned_to_center: Number(
            assignedStudentsResult?.count ?? 0,
          ),
          number_of_students_enrolled_for_exams: Number(
            enrolledStudentsResult?.count ?? 0,
          ),
          walk_in_student_count: Number(walkInCountResult?.count ?? 0),
          face_recognition_student_count: Number(
            faceRecognitionCountResult?.count ?? 0,
          ),
          csr_rating: null,
          duplicate_data_count: duplicateDataCount,
          number_of_devices_on_each_center: Number(deviceCountResult?.count ?? 0),
          number_of_devices_with_downloaded_data: Number(
            downloadedDevicesResult?.count ?? 0,
          ),
        };
      }),
    );

    return {
      success: true,
      message: 'Exam dashboard fetched successfully',
      data: {
        exam_id: examResult[0].exam_id,
        exam_code: examResult[0].exam_code,
        exam_name: examResult[0].exam_name,
        centers: rows,
      },
    };
  }
}