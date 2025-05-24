const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, mobileNo } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            mobileNo
        });

        await newUser.save();
        res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.AUTH_SECRET_KEY, {
            expiresIn: '1h'
        });

        res.status(200).json({ access: token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user by ID
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile', error });
    }
};