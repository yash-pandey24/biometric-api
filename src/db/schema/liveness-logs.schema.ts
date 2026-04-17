import {
  bigserial,
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { devices } from './devices.schema';

export const livenessLogs = pgTable('liveness_logs', {
  livenessId: bigserial('liveness_id', { mode: 'number' }).primaryKey(),
  entityType: varchar('entity_type', { length: 20 }),
  entityId: integer('entity_id'),
  deviceId: integer('device_id')
    .notNull()
    .references(() => devices.deviceId),
  isLivenessPassed: boolean('is_liveness_passed').notNull(),
  failureReason: varchar('failure_reason', { length: 200 }),
  loggedAt: timestamp('logged_at').notNull(),
});