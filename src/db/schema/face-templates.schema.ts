import {
  boolean,
  customType,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

const bytea = customType<{ data: Buffer; driverData: string }>({
  dataType() {
    return 'bytea';
  },
  toDriver(value: Buffer): string {
    return '\\x' + value.toString('hex');
  },
  fromDriver(value: string): Buffer {
    return Buffer.from(value.replace(/^\\x/, ''), 'hex');
  },
});

export const faceTemplates = pgTable('face_templates', {
  templateId: serial('template_id').primaryKey(),
  encryptedTemplate: bytea('encrypted_template').notNull(),
  templateVersion: varchar('template_version', { length: 50 }),
  isDeleted: boolean('is_deleted').default(false),
  createdAt: timestamp('created_at').notNull(),
  createdBy: varchar('created_by', { length: 100 }).notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  updatedBy: varchar('updated_by', { length: 100 }).notNull(),
  mvcc: integer('mvcc').notNull(),
});