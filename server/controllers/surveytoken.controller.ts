import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Pool, RowDataPacket } from 'mysql2/promise';

export const getSurveyByToken = async (req: Request, res: Response) => {
  const db: Pool = req.app.get('db');
  const { token } = req.params;
  
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }

  try {
    // Get survey reference data
    const [refRows] = await db.execute<RowDataPacket[]>(
      `SELECT 
        r.id as referenceId,
        r.full_name AS respondentName, 
        s.full_name AS employeeName, 
        s.position, 
        s.employee_id,
        r.is_submitted
      FROM survey_references r 
      JOIN surveys s ON r.survey_id = s.id 
      WHERE r.token = ?`,
      [token]
    );

    if (refRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid survey token' });
    }

    const refData = refRows[0];
    console.log(refData);
    // Get questions
    const [questions] = await db.execute<RowDataPacket[]>(
      'SELECT id, text FROM questions'
    );

    return res.json({
      success: true,
      referenceId: refData.referenceId,
      employeeId: refData.employee_id,
      employeeName: refData.employeeName,
      position: refData.position,
      respondentName: refData.respondentName,
      questions,
      is_submitted: Boolean(refData.is_submitted)
    });
  } catch (error) {
    console.error('Error fetching survey by token:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching survey' 
    });
  }
};