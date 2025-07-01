import express from 'express';
import { login, protectedRoute } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticateToken } from '../middleware/authenticateToken';

const authRoutes = express.Router();

authRoutes.post('/login', asyncHandler(login));
authRoutes.get('/protected', authenticateToken, asyncHandler(protectedRoute));

export default authRoutes;