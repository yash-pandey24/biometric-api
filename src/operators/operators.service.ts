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
import { centers, operators } from '../db/schema';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';

@Injectable()
export class OperatorsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(dto: CreateOperatorDto) {
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

    const existingOperator = await this.drizzleDb
      .select()
      .from(operators)
      .where(eq(operators.operatorCode, dto.operator_code));

    if (existingOperator.length > 0) {
      throw new BadRequestException({
        success: false,
        message: 'Operator code already exists',
      });
    }

    try {
      await this.drizzleDb.insert(operators).values({
        templateId: dto.template_id,
        operatorCode: dto.operator_code,
        firstName: dto.first_name,
        middleName: dto.middle_name ?? null,
        lastName: dto.last_name ?? null,
        mobileNumber: dto.mobile_number ?? null,
        assignedCenterId: dto.assigned_center_id,
        operatorImage: dto.operator_image ?? null,
        documents: dto.documents ?? null,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: dto.created_by,
        updatedAt: new Date(),
        updatedBy: dto.updated_by,
        mvcc: 1,
      });

      return {
        success: true,
        message: 'Operator created successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create operator',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }

  async findAll() {
    const result = await this.drizzleDb
      .select({
        operator_id: operators.operatorId,
        template_id: operators.templateId,
        operator_code: operators.operatorCode,
        first_name: operators.firstName,
        middle_name: operators.middleName,
        last_name: operators.lastName,
        mobile_number: operators.mobileNumber,
        assigned_center_id: operators.assignedCenterId,
        operator_image: operators.operatorImage,
        documents: operators.documents,
        is_deleted: operators.isDeleted,
        created_at: operators.createdAt,
        created_by: operators.createdBy,
        updated_at: operators.updatedAt,
        updated_by: operators.updatedBy,
        mvcc: operators.mvcc,
      })
      .from(operators)
      .where(eq(operators.isDeleted, false));

    return {
      success: true,
      message: 'Operators fetched successfully',
      data: result,
    };
  }

  async findOne(id: number) {
    const result = await this.drizzleDb
      .select({
        operator_id: operators.operatorId,
        template_id: operators.templateId,
        operator_code: operators.operatorCode,
        first_name: operators.firstName,
        middle_name: operators.middleName,
        last_name: operators.lastName,
        mobile_number: operators.mobileNumber,
        assigned_center_id: operators.assignedCenterId,
        operator_image: operators.operatorImage,
        documents: operators.documents,
        is_deleted: operators.isDeleted,
        created_at: operators.createdAt,
        created_by: operators.createdBy,
        updated_at: operators.updatedAt,
        updated_by: operators.updatedBy,
        mvcc: operators.mvcc,
      })
      .from(operators)
      .where(and(eq(operators.operatorId, id), eq(operators.isDeleted, false)));

    if (result.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Operator not found',
      });
    }

    return {
      success: true,
      message: 'Operator fetched successfully',
      data: result[0],
    };
  }

  async update(id: number, dto: UpdateOperatorDto) {
    const existingOperator = await this.drizzleDb
      .select()
      .from(operators)
      .where(and(eq(operators.operatorId, id), eq(operators.isDeleted, false)));

    if (existingOperator.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Operator not found',
      });
    }

    if (dto.operator_code) {
      const duplicate = await this.drizzleDb
        .select()
        .from(operators)
        .where(eq(operators.operatorCode, dto.operator_code));

      if (duplicate.length > 0 && duplicate[0].operatorId !== id) {
        throw new BadRequestException({
          success: false,
          message: 'Operator code already exists',
        });
      }
    }

    if (dto.assigned_center_id !== undefined) {
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
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: dto.updated_by ?? existingOperator[0].updatedBy,
      mvcc: (existingOperator[0].mvcc ?? 0) + 1,
    };

    if (dto.template_id !== undefined) {
      updatePayload.templateId = dto.template_id;
    }
    if (dto.operator_code !== undefined) {
      updatePayload.operatorCode = dto.operator_code;
    }
    if (dto.first_name !== undefined) {
      updatePayload.firstName = dto.first_name;
    }
    if (dto.middle_name !== undefined) {
      updatePayload.middleName = dto.middle_name;
    }
    if (dto.last_name !== undefined) {
      updatePayload.lastName = dto.last_name;
    }
    if (dto.mobile_number !== undefined) {
      updatePayload.mobileNumber = dto.mobile_number;
    }
    if (dto.assigned_center_id !== undefined) {
      updatePayload.assignedCenterId = dto.assigned_center_id;
    }
    if (dto.operator_image !== undefined) {
      updatePayload.operatorImage = dto.operator_image;
    }
    if (dto.documents !== undefined) {
      updatePayload.documents = dto.documents;
    }

    try {
      await this.drizzleDb
        .update(operators)
        .set(updatePayload)
        .where(eq(operators.operatorId, id));

      return {
        success: true,
        message: 'Operator updated successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update operator',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }

  async remove(id: number) {
    const existingOperator = await this.drizzleDb
      .select()
      .from(operators)
      .where(and(eq(operators.operatorId, id), eq(operators.isDeleted, false)));

    if (existingOperator.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Operator not found',
      });
    }

    try {
      await this.drizzleDb
        .update(operators)
        .set({
          isDeleted: true,
          updatedAt: new Date(),
          mvcc: (existingOperator[0].mvcc ?? 0) + 1,
        })
        .where(eq(operators.operatorId, id));

      return {
        success: true,
        message: 'Operator deleted successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete operator',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }
}