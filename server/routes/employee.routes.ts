import express from 'express';
import { getEmployees } from '../controllers/employee.controller';
import { authenticateToken } from '../middleware/authenticateToken';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.get('/', authenticateToken, asyncHandler(getEmployees));

export default router;