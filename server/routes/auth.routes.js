"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const authenticateToken_1 = require("../middleware/authenticateToken");
const authRoutes = express_1.default.Router();
authRoutes.post('/login', (0, asyncHandler_1.asyncHandler)(auth_controller_1.login));
authRoutes.get('/protected', authenticateToken_1.authenticateToken, (0, asyncHandler_1.asyncHandler)(auth_controller_1.protectedRoute));
exports.default = authRoutes;
