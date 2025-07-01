import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { console } from 'inspector';

export const getQuestions = async (req: Request, res: Response) => {
  const db: Pool = req.app.get('db');

  try {
    const [questions] = await db.execute<RowDataPacket[]>("SELECT * FROM questions WHERE status != ? OR status IS NULL ORDER BY arrange_order ASC", ['deleted']);

    return res.json({
      success: true,
      questions: questions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ error: 'Failed to fetch questions' });
  }
};


export const submitQuestions = async (req: Request, res: Response) => {
  const db: Pool = req.app.get('db');
  const { sorted } = req.body;

  try {
    for (const question of sorted) {
      const [result] = await db.execute<RowDataPacket[]>(
        'SELECT * FROM questions WHERE id = ?',
        [question.id]
      );

      if (result.length === 0) {
        await db.execute<ResultSetHeader>(
          'INSERT INTO questions (text, arrange_order) VALUES (?, ?)',
          [question.text, question.arrange_order]
        );
      } else {
        await db.execute<ResultSetHeader>(
          'UPDATE questions SET text = ?, arrange_order = ? WHERE id = ?',
          [question.text, question.arrange_order, question.id]
        );
      }
    }

    return res.json({
      success: true,
      message: 'Updated questions',
    });
  } catch (error) {
    console.error('Error updating questions:', error);
    return res.status(500).json({ error: 'Failed to update questions' });
  }

};

export const deleteQuestions = async (req: Request, res: Response) => {
  const db: Pool = req.app.get('db');
  const {id} = req.body;
  // console.log(id);
  try {
    const [result] = await db.execute<ResultSetHeader>(
      'UPDATE questions SET status = ? WHERE id = ?', 
      ['deleted', id]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    return res.json({
      success: true,
      message: 'Question marked as deleted'
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ error: 'Failed to fetch questions' });
  }
};