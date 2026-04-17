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
  candidates,
  centers,
  examCenterR,
  exams,
  faceTemplates,
} from '../db/schema';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  private async validateReferences(dto: {
    exam_id: number;
    template_id: number;
    assigned_center_id: number;
    exam_center_r_id: number;
    exam_date: string;
  }) {
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

    const template = await this.drizzleDb
      .select()
      .from(faceTemplates)
      .where(
        and(
          eq(faceTemplates.templateId, dto.template_id),
          eq(faceTemplates.isDeleted, false),
        ),
      );

    if (template.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid template_id',
      });
    }

    const center = await this.drizzleDb
      .select()
      .from(centers)
      .where(
        and(
          eq(centers.centerId, dto.assigned_center_id),
          eq(centers.isDeleted, false),
        ),
      );

    if (center.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid assigned_center_id',
      });
    }

    const mapping = await this.drizzleDb
      .select()
      .from(examCenterR)
      .where(eq(examCenterR.examCenterRId, dto.exam_center_r_id));

    if (mapping.length === 0) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid exam_center_r_id',
      });
    }

    if (
      mapping[0].examId !== dto.exam_id ||
      mapping[0].centerId !== dto.assigned_center_id
    ) {
      throw new BadRequestException({
        success: false,
        message:
          'exam_center_r_id does not match the given exam_id and assigned_center_id',
      });
    }
  }
  async create(dto: CreateCandidateDto) {
    const existing = await this.drizzleDb
      .select()
      .from(candidates)
      .where(eq(candidates.rollNumber, dto.roll_number));

    if (existing.length > 0) {
      throw new BadRequestException({
        success: false,
        message: 'Roll number already exists',
      });
    }

    await this.validateReferences(dto);

    try {
      await this.drizzleDb.insert(candidates).values({
      examId: dto.exam_id,
      templateId: dto.template_id,
      rollNumber: dto.roll_number,
      registrationNumber: dto.registration_number ?? null,
      firstName: dto.first_name,
      middleName: dto.middle_name ?? null,
      lastName: dto.last_name ?? null,
      assignedCenterId: dto.assigned_center_id,
      examDate: dto.exam_date,
      isWalkinCandidate: dto.is_walkin_candidate ?? false,
      examCenterRId: dto.exam_center_r_id,
      isDeleted: false,
      createdAt: new Date(),
      createdBy: dto.created_by,
      updatedAt: new Date(),
      updatedBy: dto.updated_by,
      mvcc: 1,
    });

      return {
        success: true,
        message: 'Candidate created successfully',
      };
    } catch (error: any) {
      console.error('Create candidate DB error:', error);

      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create candidate',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }

  async findAll() {
    const data = await this.drizzleDb
      .select({
        candidate_id: candidates.candidateId,
        exam_id: candidates.examId,
        template_id: candidates.templateId,
        roll_number: candidates.rollNumber,
        registration_number: candidates.registrationNumber,
        first_name: candidates.firstName,
        middle_name: candidates.middleName,
        last_name: candidates.lastName,
        assigned_center_id: candidates.assignedCenterId,
        exam_date: candidates.examDate,
        is_walkin_candidate: candidates.isWalkinCandidate,
        exam_center_r_id: candidates.examCenterRId,
        is_deleted: candidates.isDeleted,
        created_at: candidates.createdAt,
        created_by: candidates.createdBy,
        updated_at: candidates.updatedAt,
        updated_by: candidates.updatedBy,
        mvcc: candidates.mvcc,
      })
      .from(candidates)
      .where(eq(candidates.isDeleted, false));

    return {
      success: true,
      message: 'Candidates fetched successfully',
      data,
    };
  }

  async findOne(id: number) {
    const result = await this.drizzleDb
      .select({
        candidate_id: candidates.candidateId,
        exam_id: candidates.examId,
        template_id: candidates.templateId,
        roll_number: candidates.rollNumber,
        registration_number: candidates.registrationNumber,
        first_name: candidates.firstName,
        middle_name: candidates.middleName,
        last_name: candidates.lastName,
        assigned_center_id: candidates.assignedCenterId,
        exam_date: candidates.examDate,
        is_walkin_candidate: candidates.isWalkinCandidate,
        exam_center_r_id: candidates.examCenterRId,
        is_deleted: candidates.isDeleted,
        created_at: candidates.createdAt,
        created_by: candidates.createdBy,
        updated_at: candidates.updatedAt,
        updated_by: candidates.updatedBy,
        mvcc: candidates.mvcc,
      })
      .from(candidates)
      .where(and(eq(candidates.candidateId, id), eq(candidates.isDeleted, false)));

    if (!result.length) {
      throw new NotFoundException({
        success: false,
        message: 'Candidate not found',
      });
    }

    return {
      success: true,
      message: 'Candidate fetched successfully',
      data: result[0],
    };
  }

  async update(id: number, dto: UpdateCandidateDto) {
    const existing = await this.drizzleDb
      .select()
      .from(candidates)
      .where(and(eq(candidates.candidateId, id), eq(candidates.isDeleted, false)));

    if (!existing.length) {
      throw new NotFoundException({
        success: false,
        message: 'Candidate not found',
      });
    }

    if (dto.roll_number) {
      const duplicate = await this.drizzleDb
        .select()
        .from(candidates)
        .where(eq(candidates.rollNumber, dto.roll_number));

      if (duplicate.length > 0 && duplicate[0].candidateId !== id) {
        throw new BadRequestException({
          success: false,
          message: 'Roll number already exists',
        });
      }
    }

    const nextValues = {
      exam_id: dto.exam_id ?? existing[0].examId,
      template_id: dto.template_id ?? existing[0].templateId,
      assigned_center_id: dto.assigned_center_id ?? existing[0].assignedCenterId,
      exam_date: dto.exam_date ?? existing[0].examDate,
      exam_center_r_id: dto.exam_center_r_id ?? existing[0].examCenterRId,
    };

    await this.validateReferences(nextValues);

    const payload: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: dto.updated_by ?? existing[0].updatedBy,
      mvcc: (existing[0].mvcc ?? 0) + 1,
    };

    if (dto.exam_id !== undefined) payload.examId = dto.exam_id;
    if (dto.template_id !== undefined) payload.templateId = dto.template_id;
    if (dto.roll_number !== undefined) payload.rollNumber = dto.roll_number;
    if (dto.registration_number !== undefined)
      payload.registrationNumber = dto.registration_number;
    if (dto.first_name !== undefined) payload.firstName = dto.first_name;
    if (dto.middle_name !== undefined) payload.middleName = dto.middle_name;
    if (dto.last_name !== undefined) payload.lastName = dto.last_name;
    if (dto.assigned_center_id !== undefined)
      payload.assignedCenterId = dto.assigned_center_id;
    if (dto.exam_date !== undefined) payload.examDate = dto.exam_date;
    if (dto.is_walkin_candidate !== undefined)
      payload.isWalkinCandidate = dto.is_walkin_candidate;
    if (dto.exam_center_r_id !== undefined)
      payload.examCenterRId = dto.exam_center_r_id;

    await this.drizzleDb
      .update(candidates)
      .set(payload)
      .where(eq(candidates.candidateId, id));

    return {
      success: true,
      message: 'Candidate updated successfully',
    };
  }

  async remove(id: number) {
    const existing = await this.drizzleDb
      .select()
      .from(candidates)
      .where(and(eq(candidates.candidateId, id), eq(candidates.isDeleted, false)));

    if (!existing.length) {
      throw new NotFoundException({
        success: false,
        message: 'Candidate not found',
      });
    }

    await this.drizzleDb
      .update(candidates)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
        mvcc: (existing[0].mvcc ?? 0) + 1,
      })
      .where(eq(candidates.candidateId, id));

    return {
      success: true,
      message: 'Candidate deleted successfully',
    };
  }
}