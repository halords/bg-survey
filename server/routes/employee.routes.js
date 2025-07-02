"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employee_controller_1 = require("../controllers/employee.controller");
const authenticateToken_1 = require("../middleware/authenticateToken");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = express_1.default.Router();
router.get('/', authenticateToken_1.authenticateToken, (0, asyncHandler_1.asyncHandler)(employee_controller_1.getEmployees));
exports.default = router;
