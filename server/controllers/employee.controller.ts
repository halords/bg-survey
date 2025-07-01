import { Request, Response } from 'express';
import { Pool, RowDataPacket } from 'mysql2/promise';
import { Employee } from '../types';

export const getEmployees = async (req: Request, res: Response) => {
  const db: Pool = req.app.get('db');

  try {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT 
        e.id AS employeeId,
        e.full_name AS fullName,
        e.position,
        sr.id AS referenceId,
        sr.full_name AS referenceName,
        sr.email,
        sr.is_submitted AS isSubmitted,
        sr.link,
        sr.notification_type,
        sresp.question_id AS questionId,
        sresp.rating,
        sresp.comments AS comments
      FROM employees e
      JOIN surveys es ON e.id = es.employee_id
      JOIN survey_references sr ON es.id = sr.survey_id
      LEFT JOIN responses sresp ON sr.id = sresp.reference_id
      ORDER BY e.id ASC
    `);

    const [questions] = await db.query<RowDataPacket[]>('SELECT text FROM questions');

    const employees: Employee[] = [];
    const employeeMap = new Map<number, Employee>();

    for (const row of rows) {
      if (!employeeMap.has(row.employeeId)) {
        employeeMap.set(row.employeeId, {
          id: row.employeeId,
          fullName: row.fullName,
          position: row.position,
          ref: [],
          questions: questions.map(q => q.text),
        });
      }

      const employee = employeeMap.get(row.employeeId)!;
      let reference = employee.ref.find(ref => ref.id === row.referenceId);
      
      if (!reference) {
        reference = {
          id: row.referenceId,
          fullName: row.referenceName,
          email: row.email,
          link: row.link,
          is_submitted: !!row.isSubmitted,
          comments: '',
          notification_type: row.notification_type,
          responses: []
        };
        employee.ref.push(reference);
      }

      if (row.questionId !== null && row.rating !== null) {
        reference.responses!.push({
          questionId: row.questionId,
          referenceId: row.referenceId,
          rating: row.rating
        });
      }
      
      if (row.questionId === null && row.comments !== null) {
        reference.comments = row.comments;
      }
    }

    res.json(Array.from(employeeMap.values()));
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};