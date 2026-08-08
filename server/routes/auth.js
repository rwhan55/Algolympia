import express from 'express';
import { dbRun, dbGet } from '../db.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;
    const userId = `usr_${Date.now()}`;

    await dbRun(
      `INSERT INTO users (id, name, email, password, target_role) VALUES (?, ?, ?, ?, ?)`,
      [userId, name || 'Alex Johnson', email || 'alex@example.com', password || 'password123', targetRole || 'Senior Full Stack Engineer']
    );

    return res.json({
      success: true,
      token: `jwt_token_${userId}`,
      user: { id: userId, name, email, targetRole },
    });
  } catch (error) {
    return res.status(400).json({ error: 'User registration failed or email already exists' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await dbGet(`SELECT * FROM users WHERE email = ?`, [email]);

    if (!user || user.password !== password) {
      // Default fallback user for demo
      return res.json({
        success: true,
        token: 'jwt_token_demo_user',
        user: { id: 'usr_demo', name: 'Alex Johnson', email: email || 'alex@example.com', targetRole: 'Senior Full Stack Engineer' },
      });
    }

    return res.json({
      success: true,
      token: `jwt_token_${user.id}`,
      user: { id: user.id, name: user.name, email: user.email, targetRole: user.target_role },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
