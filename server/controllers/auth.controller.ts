import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Pool, RowDataPacket } from 'mysql2/promise';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db: Pool = req.app.get('db');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // SECURITY WARNING: Never store plain text passwords in production!
    // This is just for demonstration. Use bcrypt.compare() with hashed passwords.
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT id, email FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    return res.json({ 
      success: true, 
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const protectedRoute = async (req: Request, res: Response) => {
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