import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { Employee } from '../my-app/src/types';
// import './types/express'; 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/authenticateToken'; 
import { db } from './config/db';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Login route (query database instead of mock)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await (await db).execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    // @ts-ignore - TypeScript doesn't know rows has length
    if (rows.length > 0) {
      const user = rows[0];

      // Payload to encode
      const payload = {
        id: user.id,
        email: user.email
      };

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
      });
      // console.log(token);
      res.json({ success: true, token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all employees
app.get('/employees', authenticateToken, async (req, res) => {
   try {
    const [rows]: any[] = await (await db).query(`
      SELECT 
          e.id AS employeeId,
          e.full_name AS fullName,
          e.position,
          sr.id AS referenceId,
          sr.full_name AS referenceName,
          sr.email,
          sr.is_submitted AS isSubmitted,
          sr.link,
          sresp.question_id AS questionId,
          sresp.rating,
          sresp.comments AS comments
      FROM employees e
      JOIN surveys es ON e.id = es.employee_id
      JOIN survey_references sr ON es.id = sr.survey_id
      LEFT JOIN responses sresp ON sr.id = sresp.reference_id
      ORDER BY e.id, sr.id
    `);

    const [questions]: any[] = await (await db).query('SELECT text FROM questions');
    // Transform rows into a structured format

    const employees: Employee[] = [];

    const employeeMap = new Map<number, Employee>();

    for (const row of rows) {
      // If employee doesn't exist yet, create one
      if (!employeeMap.has(row.employeeId)) {
        employeeMap.set(row.employeeId, {
          id: row.employeeId,
          fullName: row.fullName,
          position: row.position,
          ref: [],
          questions: questions.map((q: any) => q.text), // Assuming all employees have the same questions
        });
      }

      const employee = employeeMap.get(row.employeeId)!;

      // Find or add the reference
      let reference = employee.ref.find(ref => ref.id === row.referenceId);
      if (!reference) {
        reference = {
          id: row.referenceId,
          fullName: row.referenceName,
          email: row.email,
          link: row.link,
          is_submitted: !!row.isSubmitted,
          comments: '',
          responses: []
        };
        employee.ref.push(reference);
      }

      // If there's a response, push it
      if (row.questionId !== null && row.rating !== null) {
        reference.responses!.push({
          questionId: row.questionId,
          referenceId: row.referenceId,
          rating: row.rating
        });
      }
      if (row.questionId === null && row.comments!== null) {
        reference.comments = row.comments; // Store the "rating" as comments
        // console.log(row.comments);
      }
    }

    res.json(Array.from(employeeMap.values()));
  } catch (err) {
    console.error('Error building employee structure:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Create a new survey
app.post('/surveys', authenticateToken, async (req, res) => {
  const { employeeId, fullName, position, references } = req.body;

  if (!employeeId || !fullName || !position || !references || references.length < 3) {
    res.status(400).json({ error: 'Missing fields or less than 3 references' });
  }else{

  try {
    // Check if employee exists
    const [existingEmployee]: any = await (await db).execute(
      'SELECT id FROM employees WHERE id = ?',
      [employeeId]
    );

    if (existingEmployee.length === 0) {
      // Insert employee if not found
      await (await db).execute(
        'INSERT INTO employees (id, full_name, position) VALUES (?, ?, ?)',
        [employeeId, fullName, position]
      );
    }

    // Insert survey
    const [surveyResult]: any = await (await db).execute(
      'INSERT INTO surveys (employee_id, full_name, position, created_at) VALUES (?, ?, ?, NOW())',
      [employeeId, fullName, position]
    );
    const surveyId = surveyResult.insertId;

    const generatedReferences = [];

    for (const ref of references) {
      const token = uuidv4();
      const link = `http://localhost:5173/survey/${token}`;

      await (await db).execute(
        'INSERT INTO survey_references (survey_id, full_name, email, token, link) VALUES (?, ?, ?, ?, ?)',
        [surveyId, ref.fullName, ref.email, token, link]
      );

      generatedReferences.push({ ...ref, token, link });
    }

    res.json({
      success: true,
      survey: { employeeId, fullName, position, references: generatedReferences },
    });
  } catch (err) {
    console.error('Survey creation failed:', err);
    res.status(500).json({ error: 'Failed to create survey' });
  }
}
});

// Get survey by token
app.get('/api/survey/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const [refRows]: any = await (await db).execute(
      `SELECT 
         r.id as refID,
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
       res.status(404).json({ success: false, message: 'Invalid survey token' });
    }else{

    const refData = refRows[0];

    const [questions]: any = await (await db).execute(
      'SELECT id, text FROM questions'
    );

    res.json({
      success: true,
      referenceId: refData.refID,
      employeeId: refData.employee_id,
      employeeName: refData.employeeName,
      position: refData.position,
      respondentName: refData.respondentName,
      questions, 
      is_submitted: refData.is_submitted
    });
  }
  } catch (err) {
    console.error('Error fetching survey by token:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching survey' });
  }
  
});

app.post('/submit-survey', async (req, res) => {
  const { refId, questions, comments } = req.body;
  
  // Validate input
  if (!refId || !questions || !Array.isArray(questions)) {
     res.status(400).json({ success: false, error: 'Invalid request data' });
  }else{

    try {
      await (await db).beginTransaction();

      // Insert all question responses
      for (const result of questions) {
        if (!result.id || !result.rating) continue; // basic validation
        await (await db).execute(
          'INSERT INTO responses (reference_id, question_id, rating) VALUES (?, ?, ?)',
          [refId, result.id, result.rating]
        );
      }

      // Insert comments (consider using a separate table)
      if (comments) {
        await (await db).execute(
          'INSERT INTO responses (reference_id, question_id, comments) VALUES (?, ?, ?)',
          [refId, null, comments] // Using null instead of '-' for proper NULL in database
        );
      }

      // Update submission status
      await (await db).execute(
        'UPDATE survey_references SET is_submitted = ? WHERE id = ?',
        [true, refId] // Assuming refId is the ID of the survey_reference
      );

      await (await db).commit();
      res.json({ success: true, message: 'Survey submitted successfully' });
    } catch (error) {
      await (await db).rollback();
      console.error('Error submitting survey:', error);
      res.status(500).json({ success: false, error: 'Failed to submit survey' });
    }
  }
});

// ✅ Listen on 0.0.0.0 to accept external/local network connections
const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host as string, () => {
  console.log(`🚀 Server running on http://${host}:${port}`);
});