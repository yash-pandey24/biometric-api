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
import { auditLogs, devices } from '../db/schema';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  async create(dto: CreateAuditLogDto) {
    if (dto.device_id) {
      const device = await this.drizzleDb
        .select()
        .from(devices)
        .where(eq(devices.deviceId, dto.device_id));

      if (!device.length) {
        throw new BadRequestException({ success: false, message: 'Invalid device_id' });
      }
    }

    try {
      await this.drizzleDb.insert(auditLogs).values({
        actionType: dto.action_type ?? null,
        entityName: dto.entity_name ?? null,
        entityId: dto.entity_id ?? null,
        performedBy: dto.performed_by ?? null,
        deviceId: dto.device_id ?? null,
        ipAddress: dto.ip_address ?? null,
        createdAt: new Date(),
      });

      return {
        success: true,
        message: 'Audit log created successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create audit log',
        detail: error?.message,
      });
    }
  }

  async findAll() {
    const data = await this.drizzleDb.select().from(auditLogs);
    return { success: true, message: 'Audit logs fetched successfully', data };
  }

  async findOne(id: number) {
    const data = await this.drizzleDb
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.auditId, id));

    if (!data.length) {
      throw new NotFoundException({
        success: false,
        message: 'Audit log not found',
      });
    }

    return {
      success: true,
      message: 'Audit log fetched successfully',
      data: data[0],
    };
  }
}