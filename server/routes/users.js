import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();
const salt = 10;

// route to register a new user
router.post('/register-user', async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPW = await bcrypt.hashSync(password, salt)

    try {
        const existing = await User.findOne({ $or: [{ username }, { email }]});
        if (existing) {
            return res.status(400).json({ message: 'Username or email already taken.'})
        }

        const newUser = new User({
            username,
            email,
            password: hashedPW
        });

        const user = await newUser.save();
        res.status(201).json(user);
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
            if (user.username === username || user.email === email) {
                return res.status(400).json({ message: 'That username or email is already taken.'})
            }
        }
        res.status(200).json({ message: 'Values are valid.'});
    } catch (err) {
        res.status(500).json({ message: '`Server error`'})
    }
});

export default router;