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
import { centers, devices } from '../db/schema';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(dto: CreateDeviceDto) {
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

    const existingUniqueId = await this.drizzleDb
      .select()
      .from(devices)
      .where(eq(devices.deviceUniqueId, dto.device_unique_id));

    if (existingUniqueId.length > 0) {
      throw new BadRequestException({
        success: false,
        message: 'device_unique_id already exists',
      });
    }

    try {
      await this.drizzleDb.insert(devices).values({
        centerId: dto.center_id,
        deviceUniqueId: dto.device_unique_id,
        imei: dto.imei ?? null,
        registrationToken: dto.registration_token,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: dto.created_by,
        updatedAt: new Date(),
        updatedBy: dto.updated_by,
        mvcc: 1,
      });

      return {
        success: true,
        message: 'Device created successfully',
      };
    } catch (error: any) {
      console.error('Create device DB error:', error);

      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create device',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }

  async findAll() {
    const data = await this.drizzleDb
      .select({
        device_id: devices.deviceId,
        center_id: devices.centerId,
        device_unique_id: devices.deviceUniqueId,
        imei: devices.imei,
        registration_token: devices.registrationToken,
        is_deleted: devices.isDeleted,
        created_at: devices.createdAt,
        created_by: devices.createdBy,
        updated_at: devices.updatedAt,
        updated_by: devices.updatedBy,
        mvcc: devices.mvcc,
      })
      .from(devices)
      .where(eq(devices.isDeleted, false));

    return {
      success: true,
      message: 'Devices fetched successfully',
      data,
    };
  }

  async findOne(id: number) {
    const result = await this.drizzleDb
      .select({
        device_id: devices.deviceId,
        center_id: devices.centerId,
        device_unique_id: devices.deviceUniqueId,
        imei: devices.imei,
        registration_token: devices.registrationToken,
        is_deleted: devices.isDeleted,
        created_at: devices.createdAt,
        created_by: devices.createdBy,
        updated_at: devices.updatedAt,
        updated_by: devices.updatedBy,
        mvcc: devices.mvcc,
      })
      .from(devices)
      .where(and(eq(devices.deviceId, id), eq(devices.isDeleted, false)));

    if (!result.length) {
      throw new NotFoundException({
        success: false,
        message: 'Device not found',
      });
    }

    return {
      success: true,
      message: 'Device fetched successfully',
      data: result[0],
    };
  }

  async update(id: number, dto: UpdateDeviceDto) {
    const existing = await this.drizzleDb
      .select()
      .from(devices)
      .where(and(eq(devices.deviceId, id), eq(devices.isDeleted, false)));

    if (!existing.length) {
      throw new NotFoundException({
        success: false,
        message: 'Device not found',
      });
    }

    if (dto.center_id !== undefined) {
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
    }

    if (dto.device_unique_id) {
      const duplicate = await this.drizzleDb
        .select()
        .from(devices)
        .where(eq(devices.deviceUniqueId, dto.device_unique_id));

      if (duplicate.length > 0 && duplicate[0].deviceId !== id) {
        throw new BadRequestException({
          success: false,
          message: 'device_unique_id already exists',
        });
      }
    }

    const payload: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: dto.updated_by ?? existing[0].updatedBy,
      mvcc: (existing[0].mvcc ?? 0) + 1,
    };

    if (dto.center_id !== undefined) payload.centerId = dto.center_id;
    if (dto.device_unique_id !== undefined) payload.deviceUniqueId = dto.device_unique_id;
    if (dto.imei !== undefined) payload.imei = dto.imei;
    if (dto.registration_token !== undefined)
      payload.registrationToken = dto.registration_token;

    try {
      await this.drizzleDb
        .update(devices)
        .set(payload)
        .where(eq(devices.deviceId, id));

      return {
        success: true,
        message: 'Device updated successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update device',
        detail: error?.message,
        db_detail: error?.cause?.message ?? null,
      });
    }
  }

  async remove(id: number) {
    const existing = await this.drizzleDb
      .select()
      .from(devices)
      .where(and(eq(devices.deviceId, id), eq(devices.isDeleted, false)));

    if (!existing.length) {
      throw new NotFoundException({
        success: false,
        message: 'Device not found',
      });
    }

    await this.drizzleDb
      .update(devices)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
        mvcc: (existing[0].mvcc ?? 0) + 1,
      })
      .where(eq(devices.deviceId, id));

    return {
      success: true,
      message: 'Device deleted successfully',
    };
  }
}