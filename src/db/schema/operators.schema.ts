import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { faceTemplates } from './face-templates.schema';
import { centers } from './centers.schema';

export const operators = pgTable('operators', {
  operatorId: serial('operator_id').primaryKey(),

  templateId: integer('template_id')
    .notNull()
    .references(() => faceTemplates.templateId),

  operatorCode: varchar('operator_code', { length: 100 }).notNull().unique(),

  firstName: varchar('first_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  mobileNumber: varchar('mobile_number', { length: 20 }),

  assignedCenterId: integer('assigned_center_id')
    .notNull()
    .references(() => centers.centerId),

  operatorImage: text('operator_image'),
  documents: jsonb('documents'),

  isDeleted: boolean('is_deleted').default(false),

  createdAt: timestamp('created_at').notNull(),
  createdBy: varchar('created_by', { length: 100 }).notNull(),

  updatedAt: timestamp('updated_at').notNull(),
  updatedBy: varchar('updated_by', { length: 100 }).notNull(),

  mvcc: integer('mvcc').notNull(),
});