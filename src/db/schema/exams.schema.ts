import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const examTypeEnum = pgEnum('exam_type_enum', ['CBT', 'OMR', 'TABLET']);

export const exams = pgTable('exams', {
  examId: serial('exam_id').primaryKey(),
  examCode: varchar('exam_code', { length: 100 }).notNull().unique(),
  examName: varchar('exam_name', { length: 200 }).notNull(),
  examType: examTypeEnum('exam_type'),
  examStartDate: date('exam_start_date').notNull(),
  examEndDate: date('exam_end_date').notNull(),
  frRequired: boolean('fr_required').default(false),
  frType: varchar('fr_type', { length: 50 }),
  biometricRequired: boolean('biometric_required').default(false),
  geoFencingRequired: boolean('geo_fencing_required').default(false),
  isDeleted: boolean('is_deleted').default(false),
  createdAt: timestamp('created_at').notNull(),
  createdBy: varchar('created_by', { length: 100 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  updatedBy: varchar('updated_by', { length: 100 }).notNull(),
  mvcc: integer('mvcc').notNull(),
});