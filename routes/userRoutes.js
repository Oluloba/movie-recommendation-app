const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/authMiddleware');

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save favorite movie
router.post('/favorites', verifyToken, async (req, res) => {
  const { movieId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove favorite movie
router.delete('/favorites/:movieId', verifyToken, async (req, res) => {
  const { movieId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(id => id !== movieId);
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
