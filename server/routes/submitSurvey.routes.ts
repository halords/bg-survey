import express from 'express';
import { submitSurvey } from '../controllers/submitSurvey.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/', asyncHandler(submitSurvey));

export default router;