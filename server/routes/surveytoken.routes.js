"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const surveytoken_controller_1 = require("../controllers/surveytoken.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = express_1.default.Router();
router.get('/:token', (0, asyncHandler_1.asyncHandler)(surveytoken_controller_1.getSurveyByToken));
exports.default = router;
