import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { exams } from './exams.schema';
import { faceTemplates } from './face-templates.schema';
import { centers } from './centers.schema';
import { examCenterR } from './exam-center-r.schema';

export const candidates = pgTable('candidates', {
  candidateId: serial('candidate_id').primaryKey(),

  examId: integer('exam_id')
    .notNull()
    .references(() => exams.examId),

  templateId: integer('template_id')
    .notNull()
    .references(() => faceTemplates.templateId),

  rollNumber: varchar('roll_number', { length: 100 }).notNull().unique(),
  registrationNumber: varchar('registration_number', { length: 100 }),

  firstName: varchar('first_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),

  assignedCenterId: integer('assigned_center_id')
    .notNull()
    .references(() => centers.centerId),

  examDate: date('exam_date').notNull(),

  isWalkinCandidate: boolean('is_walkin_candidate').default(false),

  examCenterRId: integer('exam_center_r_id')
    .notNull()
    .references(() => examCenterR.examCenterRId),

  isDeleted: boolean('is_deleted').default(false),

  createdAt: timestamp('created_at').notNull(),
  createdBy: varchar('created_by', { length: 100 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  updatedBy: varchar('updated_by', { length: 100 }).notNull(),
  mvcc: integer('mvcc').notNull(),
});