import { Injectable } from '@nestjs/common';
import { db } from '../../db/db';   // adjust path if needed
import { sql } from 'drizzle-orm';

@Injectable()
export class DeletedService {
  async getAll() {   
    const result = await db.execute(sql`
      SELECT 
          c.roll_number,
          CONCAT(c.first_name, ' ', c.last_name) AS name,
          ca.device_id,
          COALESCE(al.action_type, '-') AS comments,
          ca.is_face_match AS photo_matched,
          c.updated_by AS deleted_by,
          c.updated_at AS deleted_at

      FROM candidates c
      LEFT JOIN candidate_attendance ca 
          ON ca.candidate_id = c.candidate_id
      LEFT JOIN audit_logs al 
          ON al.entity_id = c.candidate_id

      WHERE c.is_deleted = TRUE
      ORDER BY c.updated_at DESC;
    `);

    return result.rows;
  }
}