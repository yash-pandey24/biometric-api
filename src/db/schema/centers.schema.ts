import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const centers = pgTable('centers', {
  centerId: serial('center_id').primaryKey(),
  centerCode: varchar('center_code', { length: 50 }).notNull().unique(),
  centerName: varchar('center_name', { length: 150 }).notNull(),
  addressLine1: varchar('address_line1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  latitude: numeric('latitude', { precision: 9, scale: 6 }).notNull(),
  longitude: numeric('longitude', { precision: 9, scale: 6 }).notNull(),
  allowedRadiusMeters: integer('allowed_radius_meters').notNull(),
  isDeleted: boolean('is_deleted').default(false),
  createdAt: timestamp('created_at').notNull(),
  createdBy: varchar('created_by', { length: 100 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  updatedBy: varchar('updated_by', { length: 100 }).notNull(),
  mvcc: integer('mvcc').notNull(),
});