import express from 'express';
import { createSurvey, sendMail } from '../controllers/survey.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/', asyncHandler(createSurvey));
router.post('/sendmail', asyncHandler(sendMail));

export default router;