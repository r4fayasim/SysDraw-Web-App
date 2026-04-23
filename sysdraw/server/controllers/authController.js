/**
 * SysDraw - Auth Controller (MVC: Controller Layer)
 * Handles login, registration, and token management
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'sysdraw_secret_key_2024';
const TOKEN_EXPIRY = '7d';

const AuthController = {
  /**
   * POST /api/auth/register
   * Creates a new user account
   */
  register: async (req, res) => {
    try {
      const { fullName, username, email, password } = req.body;

      if (!fullName || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      if (UserModel.findByUsername(username)) {
        return res.status(409).json({ error: 'Username already taken.' });
      }

      if (UserModel.findByEmail(email)) {
        return res.status(409).json({ error: 'Email already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = UserModel.create({ fullName, username, email, password: hashedPassword });

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
      });

      res.status(201).json({
        token,
        user: { id: user.id, fullName: user.fullName, username: user.username, email: user.email },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * POST /api/auth/login
   * Authenticates a user and returns a JWT
   */
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
      }

      const user = UserModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
      });

      res.json({
        token,
        user: { id: user.id, fullName: user.fullName, username: user.username, email: user.email },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * GET /api/auth/me
   * Returns current authenticated user info
   */
  me: (req, res) => {
    const user = UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  },
};

module.exports = AuthController;
