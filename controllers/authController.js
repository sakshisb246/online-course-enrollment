const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        // Basic validation
        if (!username || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Validate password (simple string comparison as per existing logic)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user info
        res.json({ message: 'Login successful', userId: user._id, role: user.role, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
