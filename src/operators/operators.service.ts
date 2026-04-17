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
import { operators } from '../db/schema';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';

@Injectable()
export class OperatorsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(createOperatorDto: CreateOperatorDto) {
    const existingOperator = await this.drizzleDb
      .select()
      .from(operators)
      .where(eq(operators.operatorCode, createOperatorDto.operator_code));

    if (existingOperator.length > 0) {
      throw new BadRequestException({
        success: false,
        message: 'Operator code already exists',
      });
    }

    try {
      await this.drizzleDb.insert(operators).values({
        templateId: createOperatorDto.template_id,
        operatorCode: createOperatorDto.operator_code,
        firstName: createOperatorDto.first_name,
        middleName: createOperatorDto.middle_name ?? null,
        lastName: createOperatorDto.last_name ?? null,
        mobileNumber: createOperatorDto.mobile_number ?? null,
        assignedCenterId: createOperatorDto.assigned_center_id,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: createOperatorDto.created_by,
        updatedAt: new Date(),
        updatedBy: createOperatorDto.updated_by,
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

  async update(id: number, updateOperatorDto: UpdateOperatorDto) {
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

    if (updateOperatorDto.operator_code) {
      const duplicate = await this.drizzleDb
        .select()
        .from(operators)
        .where(eq(operators.operatorCode, updateOperatorDto.operator_code));

      if (duplicate.length > 0 && duplicate[0].operatorId !== id) {
        throw new BadRequestException({
          success: false,
          message: 'Operator code already exists',
        });
      }
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: updateOperatorDto.updated_by ?? existingOperator[0].updatedBy,
      mvcc: (existingOperator[0].mvcc ?? 0) + 1,
    };

    if (updateOperatorDto.template_id !== undefined) {
      updatePayload.templateId = updateOperatorDto.template_id;
    }
    if (updateOperatorDto.operator_code !== undefined) {
      updatePayload.operatorCode = updateOperatorDto.operator_code;
    }
    if (updateOperatorDto.first_name !== undefined) {
      updatePayload.firstName = updateOperatorDto.first_name;
    }
    if (updateOperatorDto.middle_name !== undefined) {
      updatePayload.middleName = updateOperatorDto.middle_name;
    }
    if (updateOperatorDto.last_name !== undefined) {
      updatePayload.lastName = updateOperatorDto.last_name;
    }
    if (updateOperatorDto.mobile_number !== undefined) {
      updatePayload.mobileNumber = updateOperatorDto.mobile_number;
    }
    if (updateOperatorDto.assigned_center_id !== undefined) {
      updatePayload.assignedCenterId = updateOperatorDto.assigned_center_id;
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
      });
    }
  }
}