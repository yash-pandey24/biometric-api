import {
  bigserial,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { devices } from './devices.schema';

export const auditLogs = pgTable('audit_logs', {
  auditId: bigserial('audit_id', { mode: 'number' }).primaryKey(),
  actionType: varchar('action_type', { length: 50 }),
  entityName: varchar('entity_name', { length: 100 }),
  entityId: integer('entity_id'),
  performedBy: varchar('performed_by', { length: 100 }),
  deviceId: integer('device_id').references(() => devices.deviceId),
  ipAddress: varchar('ip_address', { length: 50 }),
  createdAt: timestamp('created_at').notNull(),
});