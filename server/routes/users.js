import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// route to register a new user
router.post('/register-user', async (req, res) => {
    const { username, email, password } = req.body;

    const newUser = new User({
        username,
        email,
        password
    });

    try {
        const user = await newUser.save();
        res.json(user);
    } catch (err) {
        console.log(`Error registering user: ${err}`);
        res.status(500).json({ message: 'Error :('});
    }
});

// route to check if username or email exists already
router.post('/check', async (req, res) => {
    const { username, email } = req.body;

    try {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            if (user.username === username) {
                return res.status(400).json({ message: 'That username is already taken.'})
            }
            if (user.email === email) {
                return res.status(400).json({ message: 'That Email is already in use.'})
            }
        }
        res.status(200).json({ message: 'Values are valid.'});
    } catch (err) {
        res.status(500).json({ message: '`Server error`'})
    }
});

export default router;