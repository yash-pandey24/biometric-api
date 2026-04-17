import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { centers } from './centers.schema';

export const devices = pgTable('devices', {
  deviceId: serial('device_id').primaryKey(),

  centerId: integer('center_id')
    .notNull()
    .references(() => centers.centerId),

  deviceUniqueId: varchar('device_unique_id', { length: 150 }).notNull(),
  imei: varchar('imei', { length: 50 }),
  registrationToken: varchar('registration_token', { length: 500 }).notNull(),

  isDeleted: boolean('is_deleted').default(false),

  createdAt: timestamp('created_at').notNull(),
  createdBy: varchar('created_by', { length: 100 }).notNull(),

  updatedAt: timestamp('updated_at').notNull(),
  updatedBy: varchar('updated_by', { length: 100 }).notNull(),

  mvcc: integer('mvcc').notNull(),
});