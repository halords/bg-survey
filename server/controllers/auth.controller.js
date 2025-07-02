"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = async (req, res) => {
    const { email, password } = req.body;
    const db = req.app.get('db');
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        // SECURITY WARNING: Never store plain text passwords in production!
        // This is just for demonstration. Use bcrypt.compare() with hashed passwords.
        const [rows] = await db.execute('SELECT id, email FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = rows[0];
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
const protectedRoute = async (req, res) => {
    // Properly typed user from JWT
    const user = req.user;
    res.json({
        success: true,
        message: 'Access granted to protected route',
        user: {
            id: user.id,
            email: user.email
        }
    });
};
exports.protectedRoute = protectedRoute;
