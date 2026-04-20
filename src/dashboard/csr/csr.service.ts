import { Injectable } from '@nestjs/common';
import { db } from '../../db/db';
import { sql } from 'drizzle-orm';

@Injectable()
export class CsrService {
  async getCsrData() {
    const result = await db.execute(sql`
      SELECT 
          c.center_id,
          c.center_name,

          COUNT(CASE WHEN ca.is_face_match = true THEN 1 END) AS authenticated_count,

          COALESCE(al.action_type, '-') AS feedback,

          o.documents,

          MAX(ca.attendance_time) AS date,

          CASE 
              WHEN COUNT(ca.candidate_id) > 0 THEN 'Active'
              ELSE 'Inactive'
          END AS status,

          ROUND(
              (COUNT(CASE WHEN ca.is_face_match = true THEN 1 END)::numeric 
              / NULLIF(COUNT(ca.candidate_id), 0)) * 5,
              1
          ) AS rating

      FROM centers c
      LEFT JOIN operator_sessions os ON os.center_id = c.center_id
      LEFT JOIN operators o ON os.operator_id = o.operator_id
      LEFT JOIN candidate_attendance ca ON ca.center_id = c.center_id
      LEFT JOIN audit_logs al ON al.entity_id = c.center_id

      GROUP BY c.center_id, c.center_name, o.documents, al.action_type;
    `);

    return result.rows;
  }
}