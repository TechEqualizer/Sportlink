import express from 'express';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  res.json({ message: 'Authentication endpoint - Coming soon' });
});

export default router;