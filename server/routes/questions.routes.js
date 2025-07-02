"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questions_controller_1 = require("../controllers/questions.controller");
const authenticateToken_1 = require("../middleware/authenticateToken");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = express_1.default.Router();
router.get('/', authenticateToken_1.authenticateToken, (0, asyncHandler_1.asyncHandler)(questions_controller_1.getQuestions));
router.post('/submit', authenticateToken_1.authenticateToken, (0, asyncHandler_1.asyncHandler)(questions_controller_1.submitQuestions));
router.post('/delete', authenticateToken_1.authenticateToken, (0, asyncHandler_1.asyncHandler)(questions_controller_1.deleteQuestions));
exports.default = router;
