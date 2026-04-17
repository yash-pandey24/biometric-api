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
import { centers } from '../db/schema';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';

@Injectable()
export class CentersService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(createCenterDto: CreateCenterDto) {
    const existing = await this.drizzleDb
      .select()
      .from(centers)
      .where(eq(centers.centerCode, createCenterDto.center_code));

    if (existing.length > 0) {
      throw new BadRequestException({
        success: false,
        message: 'Center code already exists',
      });
    }

    try {
      await this.drizzleDb.insert(centers).values({
        centerCode: createCenterDto.center_code,
        centerName: createCenterDto.center_name,
        addressLine1: createCenterDto.address_line1,
        addressLine2: createCenterDto.address_line2 ?? null,
        city: createCenterDto.city,
        state: createCenterDto.state,
        postalCode: createCenterDto.postal_code,
        latitude: String(createCenterDto.latitude),
        longitude: String(createCenterDto.longitude),
        allowedRadiusMeters: createCenterDto.allowed_radius_meters,
        isDeleted: false,
        createdAt: new Date(),
        createdBy: createCenterDto.created_by,
        updatedAt: new Date(),
        updatedBy: createCenterDto.updated_by,
        mvcc: 1,
      });

      return {
        success: true,
        message: 'Center created successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create center',
      });
    }
  }

  async findAll() {
    const result = await this.drizzleDb
      .select({
        center_id: centers.centerId,
        center_code: centers.centerCode,
        center_name: centers.centerName,
        address_line1: centers.addressLine1,
        address_line2: centers.addressLine2,
        city: centers.city,
        state: centers.state,
        postal_code: centers.postalCode,
        latitude: centers.latitude,
        longitude: centers.longitude,
        allowed_radius_meters: centers.allowedRadiusMeters,
        is_deleted: centers.isDeleted,
        created_at: centers.createdAt,
        updated_at: centers.updatedAt,
      })
      .from(centers)
      .where(eq(centers.isDeleted, false));

    return {
      success: true,
      message: 'Centers fetched successfully',
      data: result,
    };
  }

  async findOne(id: number) {
    const result = await this.drizzleDb
      .select({
        center_id: centers.centerId,
        center_code: centers.centerCode,
        center_name: centers.centerName,
        address_line1: centers.addressLine1,
        address_line2: centers.addressLine2,
        city: centers.city,
        state: centers.state,
        postal_code: centers.postalCode,
        latitude: centers.latitude,
        longitude: centers.longitude,
        allowed_radius_meters: centers.allowedRadiusMeters,
        is_deleted: centers.isDeleted,
        created_at: centers.createdAt,
        updated_at: centers.updatedAt,
      })
      .from(centers)
      .where(and(eq(centers.centerId, id), eq(centers.isDeleted, false)));

    if (result.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Center not found',
      });
    }

    return {
      success: true,
      message: 'Center fetched successfully',
      data: result[0],
    };
  }

  async update(id: number, updateCenterDto: UpdateCenterDto) {
    const existing = await this.drizzleDb
      .select()
      .from(centers)
      .where(and(eq(centers.centerId, id), eq(centers.isDeleted, false)));

    if (existing.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Center not found',
      });
    }

    if (updateCenterDto.center_code) {
      const duplicate = await this.drizzleDb
        .select()
        .from(centers)
        .where(eq(centers.centerCode, updateCenterDto.center_code));

      if (duplicate.length > 0 && duplicate[0].centerId !== id) {
        throw new BadRequestException({
          success: false,
          message: 'Center code already exists',
        });
      }
    }

    const payload: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: updateCenterDto.updated_by ?? existing[0].updatedBy,
      mvcc: (existing[0].mvcc ?? 0) + 1,
    };

    if (updateCenterDto.center_code !== undefined) payload.centerCode = updateCenterDto.center_code;
    if (updateCenterDto.center_name !== undefined) payload.centerName = updateCenterDto.center_name;
    if (updateCenterDto.address_line1 !== undefined) payload.addressLine1 = updateCenterDto.address_line1;
    if (updateCenterDto.address_line2 !== undefined) payload.addressLine2 = updateCenterDto.address_line2;
    if (updateCenterDto.city !== undefined) payload.city = updateCenterDto.city;
    if (updateCenterDto.state !== undefined) payload.state = updateCenterDto.state;
    if (updateCenterDto.postal_code !== undefined) payload.postalCode = updateCenterDto.postal_code;
    if (updateCenterDto.latitude !== undefined) payload.latitude = String(updateCenterDto.latitude);
    if (updateCenterDto.longitude !== undefined) payload.longitude = String(updateCenterDto.longitude);
    if (updateCenterDto.allowed_radius_meters !== undefined) payload.allowedRadiusMeters = updateCenterDto.allowed_radius_meters;

    try {
      await this.drizzleDb
        .update(centers)
        .set(payload)
        .where(eq(centers.centerId, id));

      return {
        success: true,
        message: 'Center updated successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update center',
      });
    }
  }

  async remove(id: number) {
    const existing = await this.drizzleDb
      .select()
      .from(centers)
      .where(and(eq(centers.centerId, id), eq(centers.isDeleted, false)));

    if (existing.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'Center not found',
      });
    }

    try {
      await this.drizzleDb
        .update(centers)
        .set({
          isDeleted: true,
          updatedAt: new Date(),
          mvcc: (existing[0].mvcc ?? 0) + 1,
        })
        .where(eq(centers.centerId, id));

      return {
        success: true,
        message: 'Center deleted successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete center',
      });
    }
  }
}