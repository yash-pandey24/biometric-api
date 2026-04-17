import { integer, pgTable, serial, unique } from 'drizzle-orm/pg-core';
import { exams } from './exams.schema';
import { centers } from './centers.schema';
import { shifts } from './shifts.schema';

export const examCenterR = pgTable(
  'exam_center_r',
  {
    examCenterRId: serial('exam_center_r_id').primaryKey(),

    examId: integer('exam_id')
      .notNull()
      .references(() => exams.examId),

    centerId: integer('center_id')
      .notNull()
      .references(() => centers.centerId),

    shiftId: integer('shift_id')
      .notNull()
      .references(() => shifts.shiftId),
  },
  (table) => ({
    examCenterShiftUnique: unique('uq_exam_center_shift').on(
      table.examId,
      table.centerId,
      table.shiftId,
    ),
  }),
);