import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const userTypeEnum = pgEnum('user_type_enum', [
  'SuperAdmin',
  'ExamAdmin',
  'Auditor',
]);

export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  userName: varchar('user_name', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  email: varchar('email', { length: 150 }),
  mobileNumber: varchar('mobile_number', { length: 20 }),
  userType: userTypeEnum('user_type').notNull(),
  isDeleted: boolean('is_deleted').default(false),
  createdAt: timestamp('created_at').notNull(),
  createdBy: integer('created_by').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  updatedBy: integer('updated_by').notNull(),
  lastLoginAt: timestamp('last_login_at'),
  mvcc: integer('mvcc').notNull(),
});