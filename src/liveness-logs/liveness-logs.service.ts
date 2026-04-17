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
import { devices, livenessLogs } from '../db/schema';
import { CreateLivenessLogDto } from './dto/create-liveness-log.dto';

@Injectable()
export class LivenessLogsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(dto: CreateLivenessLogDto) {
    const device = await this.drizzleDb
      .select()
      .from(devices)
      .where(eq(devices.deviceId, dto.device_id));

    if (!device.length) {
      throw new BadRequestException({ success: false, message: 'Invalid device_id' });
    }

    try {
      await this.drizzleDb.insert(livenessLogs).values({
        entityType: dto.entity_type ?? null,
        entityId: dto.entity_id ?? null,
        deviceId: dto.device_id,
        isLivenessPassed: dto.is_liveness_passed,
        failureReason: dto.failure_reason ?? null,
        loggedAt: new Date(),
      });

      return {
        success: true,
        message: 'Liveness log created successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create liveness log',
        detail: error?.message,
      });
    }
  }

  async findAll() {
    const data = await this.drizzleDb.select().from(livenessLogs);
    return { success: true, message: 'Liveness logs fetched successfully', data };
  }

  async findOne(id: number) {
    const data = await this.drizzleDb
      .select()
      .from(livenessLogs)
      .where(eq(livenessLogs.livenessId, id));

    if (!data.length) {
      throw new NotFoundException({
        success: false,
        message: 'Liveness log not found',
      });
    }

    return {
      success: true,
      message: 'Liveness log fetched successfully',
      data: data[0],
    };
  }
}