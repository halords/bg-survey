import express from 'express';
import { getSurveyByToken } from '../controllers/surveytoken.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.get('/:token', asyncHandler(getSurveyByToken));

export default router;