const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validation Regex Patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Requires at least one letter, at least one number, and at least 7 characters (>6 characters)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{7,}$/;

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ field: 'email', message: 'Please enter a valid email address.' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        field: 'password',
        message: 'Password must be more than 6 characters and contain both letters and numbers.'
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const isEmail = existingUser.email === email.toLowerCase();
      return res.status(400).json({
        field: isEmail ? 'email' : 'username',
        message: isEmail ? 'Email is already registered.' : 'Username is already taken.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, passwordHash });
    await newUser.save();

    res.status(201).json({ id: newUser._id, username: newUser.username, email: newUser.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ field: 'email', message: 'Invalid email format.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ field: 'email', message: 'No account found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ field: 'password', message: 'Incorrect password.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};