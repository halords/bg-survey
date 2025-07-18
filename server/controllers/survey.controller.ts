import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Pool, RowDataPacket } from 'mysql2/promise';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const createSurvey = async (req: Request, res: Response) => {
  const { employeeId, fullName, position, references } = req.body;
  const db: Pool = req.app.get('db');

  if (!employeeId || !fullName || !position || references.length < 3) {
    return res.status(400).json({ error: 'Missing fields or less than 3 references' });
  }

  try {
    const [existingEmployee] = await db.execute<RowDataPacket[]>(
      'SELECT id FROM employees WHERE id = ?',
      [employeeId]
    );

    if (existingEmployee.length === 0) {
      await db.execute(
        'INSERT INTO employees (id, full_name, position) VALUES (?, ?, ?)',
        [employeeId, fullName, position]
      );
    }

    const [surveyResult] = await db.execute<RowDataPacket[]>(
      'INSERT INTO surveys (employee_id, full_name, position, created_at) VALUES (?, ?, ?, NOW())',
      [employeeId, fullName, position]
    );

    const surveyId = (surveyResult as any).insertId;
    const generatedReferences = [];
    const newReferences = [];
    for (const ref of references) {
      const token = uuidv4();
      const link = `https://bg-survey-yv9o.vercel.app/survey/${token}`;
      // console.log(link);

      const [refinsert] = await db.execute(
        'INSERT INTO survey_references (survey_id, full_name, email, token, link) VALUES (?, ?, ?, ?, ?)',
        [surveyId, ref.fullName, ref.email, token, link]
      );
      const refID = (refinsert as any).insertId;
      const contents = {
        id: refID,
        fullName: ref.fullName,
        email: ref.email,
        link: link
      }
      generatedReferences.push({ ...ref, token, link });
      newReferences.push(contents);
    }

    return res.json({
      success: true,
      survey: { employeeId, fullName, position, references: newReferences },
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    return res.status(500).json({ error: 'Failed to create survey' });
  }
};

export const sendMail = async (req: Request, res: Response) => {
  // Setup transporter
  const db: Pool = req.app.get('db');

  const {references} = req.body;
  // console.log(references);
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465, false for 587
    auth: {
      user: process.env.MAIL_USER,
      pass:process.env.MAIL_APP_PASS, // Not your Gmail password
    },
  });

  try {
    for(const ref of references){
      if(ref.email !== "" || ref.email!==null){
        const info = await transporter.sendMail({
          from: `"Human Resource Management Unit, Provincial Government of La Union"`,
          to: ref.email,
          subject: "Character Reference Survey",
          html: `<!DOCTYPE html>
                  <html>
                    <body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">
                      <h2>Survey Required</h2>
                      <p>Good day Mr. ${ref.fullName},</p>
                      <br />
                      <p>You are required to complete a survey because you have been listed as one of the character references for <strong>John Doe</strong>.
                      </p><p>Your response is important and will help us evaluate the applicant fairly.</p><p>Please click the link below to answer the survey:</p>
                      <p><a href="${ref.link}" style=\"display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;\">Answer Survey</a></p><p>Thank you for your time.</p>
                      <p>– The HR Team</p>
                    </body>
                  </html>`
        });
        
        await db.execute('UPDATE survey_references set notification_type = ? WHERE id = ?', ['email', ref.id])
      }
    }
    return res.json({
      success: true,
      message: "Successfully sent the email!"
    });
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }

};