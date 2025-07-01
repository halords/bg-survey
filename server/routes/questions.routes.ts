import express from 'express';
import { deleteQuestions, getQuestions, submitQuestions } from '../controllers/questions.controller';
import { authenticateToken } from '../middleware/authenticateToken';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.get('/', authenticateToken, asyncHandler(getQuestions));
router.post('/submit', authenticateToken, asyncHandler(submitQuestions));
router.post('/delete', authenticateToken, asyncHandler(deleteQuestions));

export default router;