import { Injectable } from '@nestjs/common';
import { db } from '../../db/db';
import { sql } from 'drizzle-orm';

@Injectable()
export class EnrollmentService {
  async getData() {
    const result = await db.execute(sql`
      SELECT 
          os.device_id,
          CONCAT(o.first_name, ' ', o.last_name) AS operator_name,
          os.session_start AS login_time,
          CONCAT(c.city, ', ', c.state) AS login_address,

          ROUND(
            (COUNT(ca.candidate_id)::numeric / 200) * 100, 
            0
          ) AS enrolled_percentage,

          c.center_id

      FROM operator_sessions os
      JOIN operators o ON os.operator_id = o.operator_id
      JOIN centers c ON os.center_id = c.center_id
      LEFT JOIN candidate_attendance ca 
        ON ca.device_id = os.device_id

      GROUP BY 
          os.device_id,
          operator_name,
          os.session_start,
          c.city,
          c.state,
          c.center_id;
    `);

    return result.rows;
  }
}