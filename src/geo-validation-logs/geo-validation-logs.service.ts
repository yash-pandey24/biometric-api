import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_DB } from '../db/db.provider';
import { db } from '../db/db';
import { candidates, devices, geoValidationLogs, operators } from '../db/schema';
import { CreateGeoValidationLogDto } from './dto/create-geo-validation-log.dto';

@Injectable()
export class GeoValidationLogsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(dto: CreateGeoValidationLogDto) {
    const device = await this.drizzleDb
      .select()
      .from(devices)
      .where(eq(devices.deviceId, dto.device_id));

    if (!device.length) {
      throw new BadRequestException({ success: false, message: 'Invalid device_id' });
    }

    if (dto.operator_id) {
      const operator = await this.drizzleDb
        .select()
        .from(operators)
        .where(eq(operators.operatorId, dto.operator_id));
      if (!operator.length) {
        throw new BadRequestException({ success: false, message: 'Invalid operator_id' });
      }
    }

    if (dto.candidate_id) {
      const candidate = await this.drizzleDb
        .select()
        .from(candidates)
        .where(eq(candidates.candidateId, dto.candidate_id));
      if (!candidate.length) {
        throw new BadRequestException({ success: false, message: 'Invalid candidate_id' });
      }
    }

    try {
      await this.drizzleDb.insert(geoValidationLogs).values({
        deviceId: dto.device_id,
        actionType: dto.action_type ?? null,
        operatorId: dto.operator_id ?? null,
        candidateId: dto.candidate_id ?? null,
        latitude: dto.latitude !== undefined ? String(dto.latitude) : null,
        longitude: dto.longitude !== undefined ? String(dto.longitude) : null,
        distanceFromCenterMeters:
          dto.distance_from_center_meters !== undefined
            ? String(dto.distance_from_center_meters)
            : null,
        isValid: dto.is_valid ?? null,
        reasonCode: dto.reason_code ?? null,
        loggedAt: new Date(),
      });

      return {
        success: true,
        message: 'Geo validation log created successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create geo validation log',
        detail: error?.message,
      });
    }
  }

  async findAll() {
    const data = await this.drizzleDb.select().from(geoValidationLogs);
    return { success: true, message: 'Geo validation logs fetched successfully', data };
  }

  async findOne(id: number) {
    const data = await this.drizzleDb
      .select()
      .from(geoValidationLogs)
      .where(eq(geoValidationLogs.geoLogId, id));

    if (!data.length) {
      throw new NotFoundException({
        success: false,
        message: 'Geo validation log not found',
      });
    }

    return {
      success: true,
      message: 'Geo validation log fetched successfully',
      data: data[0],
    };
  }
}