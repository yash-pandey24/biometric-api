import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { operators } from './operators.schema';
import { exams } from './exams.schema';
import { centers } from './centers.schema';
import { shifts } from './shifts.schema';
import { devices } from './devices.schema'; // 🔥 important

export const operatorSessions = pgTable('operator_sessions', {
  sessionId: serial('session_id').primaryKey(),

  examId: integer('exam_id')
    .notNull()
    .references(() => exams.examId),

  operatorId: integer('operator_id')
    .notNull()
    .references(() => operators.operatorId),

  deviceId: integer('device_id')
    .notNull()
    .references(() => devices.deviceId),

  centerId: integer('center_id')
    .notNull()
    .references(() => centers.centerId),

  shiftId: integer('shift_id')
    .notNull()
    .references(() => shifts.shiftId),

  sessionStart: timestamp('session_start').notNull(),
  sessionEnd: timestamp('session_end'),

  isActive: boolean('is_active').default(true),
  isDeleted: boolean('is_deleted').default(false),

  createdAt: timestamp('created_at').notNull(),
  createdBy: varchar('created_by', { length: 100 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  updatedBy: varchar('updated_by', { length: 100 }).notNull(),

  mvcc: integer('mvcc').notNull(),
});