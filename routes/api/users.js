const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// @route   Get api/users/test
// @desc    Test Users route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Users works' });
});

// @route   Post api/users/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      try {
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        const user = await newUser.save();
        res.json(user);
      } catch (error) {
        res.status(400).json({ error });
      }
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

// @route   Post api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  // Find user by email
  try {
    const user = await User.findOne({ email });
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // User Matched
      const payload = { id: user.id, name: user.name }; // Create jwt payload
      // Sign Token
      jwt.sign(
        payload,
        process.env.secretOrKey,
        { expiresIn: 86400 },
        (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token
          });
        }
      );
    } else {
      errors.password = 'Password incorrect';
      return res.status(400).json(errors);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

// @route   Post api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
