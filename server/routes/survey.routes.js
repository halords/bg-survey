"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const survey_controller_1 = require("../controllers/survey.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = express_1.default.Router();
router.post('/', (0, asyncHandler_1.asyncHandler)(survey_controller_1.createSurvey));
router.post('/sendmail', (0, asyncHandler_1.asyncHandler)(survey_controller_1.sendMail));
exports.default = router;
