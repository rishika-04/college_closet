import express from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/user.js'; // your Mongoose User model

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { email, password} = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(200).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      
    });

    await newUser.save();

    // Store session
    req.session.user = { email: newUser.email, _id: newUser._id };

    res.status(201).json({ message: "Signup successful", userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    
    const { email, password } = req.body;

    // Explicitly select password since select: false in schema
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(200).json({ message: 'User not found. Please Sign Up.' });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(200).json({ message: 'Invalid password' });

    // Store session
    req.session.user = { email: user.email, _id: user._id };

    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout Route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Failed to log out');
    res.redirect("/");
  });
});


export default router;
