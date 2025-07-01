import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Pool, RowDataPacket } from 'mysql2/promise';

export const submitSurvey = async (req: Request, res: Response) => {
  const { refId, questions, comments } = req.body;
  const db: Pool = req.app.get('db');

  // Validate input
  if (!refId || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ success: false, error: 'Invalid request data' });
  }

  try {

    // Insert all question responses
    for (const result of questions) {
      if (!result.id || !result.rating) continue; // basic validation
      await db.execute(
        'INSERT INTO responses (reference_id, question_id, rating) VALUES (?, ?, ?)',
        [refId, result.id, result.rating]
      );
    }

    // Insert comments (consider using a separate table)
    if (comments) {
      await db.execute(
        'INSERT INTO responses (reference_id, question_id, comments) VALUES (?, ?, ?)',
        [refId, null, comments] // Using null instead of '-' for proper NULL in database
      );
    }

    // Update submission status
    await db.execute(
      'UPDATE survey_references SET is_submitted = ? WHERE id = ?',
      [true, refId] // Assuming refId is the ID of the survey_reference
    );
    
    res.json({ success: true, message: 'Survey submitted successfully' });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ success: false, error: 'Failed to submit survey' });
  }
};