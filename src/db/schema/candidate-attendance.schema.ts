import {
  bigserial,
  boolean,
  integer,
  numeric,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { candidates } from './candidates.schema';
import { exams } from './exams.schema';
import { operators } from './operators.schema';
import { devices } from './devices.schema';
import { centers } from './centers.schema';
import { shifts } from './shifts.schema';

export const candidateAttendance = pgTable('candidate_attendance', {
  attendanceId: bigserial('attendance_id', { mode: 'number' }).primaryKey(),

  candidateId: integer('candidate_id')
    .notNull()
    .references(() => candidates.candidateId),

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

  attendanceTime: timestamp('attendance_time').notNull(),
  latitude: numeric('latitude', { precision: 9, scale: 6 }).notNull(),
  longitude: numeric('longitude', { precision: 9, scale: 6 }).notNull(),
  matchConfidence: numeric('match_confidence', { precision: 5, scale: 2 }).notNull(),

  isGeoValid: boolean('is_geo_valid').notNull(),
  isFaceMatch: boolean('is_face_match').notNull(),
  isDeleted: boolean('is_deleted').default(false),

  createdAt: timestamp('created_at').notNull(),
  createdBy: varchar('created_by', { length: 100 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  updatedBy: varchar('updated_by', { length: 100 }).notNull(),
  mvcc: integer('mvcc').notNull(),
});