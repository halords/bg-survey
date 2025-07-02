import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import pool from './config/db';
import authRoutes from './routes/auth.routes';
import surveyRoutes from './routes/survey.routes';
import employeeRoutes from './routes/employee.routes';
import tokenRoutes from './routes/surveytoken.routes';
import submitSurvey from './routes/submitSurvey.routes';
import questions from './routes/questions.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",                 // Local dev
    "https://bg-survey-yv9o-2qxp7epct-halords-projects.vercel.app"       // Production
  ],
  credentials: true,  // Enable cookies/auth headers
}));

app.use(bodyParser.json());

// Inject db into app context
app.set('db', pool);

// Routes
app.use('/', authRoutes); // Mount auth routes
app.use('/surveys', surveyRoutes);
app.use('/employees', employeeRoutes); // Add this line
app.use('/survey', tokenRoutes); // Add this line
app.use('/submit-survey', submitSurvey); // Add this line
app.use('/questions', questions); // Add this line

// Serve static files from React dist folder - ONLY IN PRODUCTION
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'my-app', 'dist')));

  // Catch-all for SPA (must come last!)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'my-app', 'dist', 'index.html'));
  });
}
// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});