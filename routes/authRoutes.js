const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('🔐 Register request body:', req.body);

  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hash);

    const user = new User({ username, email, password: hash });
    const savedUser = await user.save();

    console.log('User saved:', savedUser);

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('✅ Incoming login request body:', req.body);
  console.log(`Email from request: "${email}" (length: ${email?.length})`);
  console.log(`Password from request: "${password}" (length: ${password?.length})`);

  try {
    const user = await User.findOne({ email });
    console.log('User found for login:', user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User password in DB:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.warn('⚠️ JWT_SECRET environment variable not set!');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
