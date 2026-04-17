import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  time,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { exams } from './exams.schema';

export const shifts = pgTable('shifts', {
  shiftId: serial('shift_id').primaryKey(),

  examId: integer('exam_id')
    .notNull()
    .references(() => exams.examId),

  examDate: date('exam_date').notNull(),
  shiftName: varchar('shift_name', { length: 50 }).notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),

  isDeleted: boolean('is_deleted').default(false),

  createdAt: timestamp('created_at').notNull(),
  createdBy: varchar('created_by', { length: 100 }).notNull(),

  updatedAt: timestamp('updated_at').notNull(),
  updatedBy: varchar('updated_by', { length: 100 }).notNull(),

  mvcc: integer('mvcc').notNull(),
});