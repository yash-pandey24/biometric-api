import {
  bigserial,
  boolean,
  integer,
  numeric,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { devices } from './devices.schema';
import { operators } from './operators.schema';
import { candidates } from './candidates.schema';

export const geoValidationLogs = pgTable('geo_validation_logs', {
  geoLogId: bigserial('geo_log_id', { mode: 'number' }).primaryKey(),
  deviceId: integer('device_id')
    .notNull()
    .references(() => devices.deviceId),
  actionType: varchar('action_type', { length: 50 }),
  operatorId: integer('operator_id').references(() => operators.operatorId),
  candidateId: integer('candidate_id').references(() => candidates.candidateId),
  latitude: numeric('latitude', { precision: 9, scale: 6 }),
  longitude: numeric('longitude', { precision: 9, scale: 6 }),
  distanceFromCenterMeters: numeric('distance_from_center_meters', {
    precision: 10,
    scale: 2,
  }),
  isValid: boolean('is_valid'),
  reasonCode: varchar('reason_code', { length: 100 }),
  loggedAt: timestamp('logged_at').notNull(),
});