import express from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();


// route to register a new user
router.post('/register', [ 
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 10 })
    ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array, message: 'An error has occured'});
    }

    const { username, email, password } = req.body;

    const salt = 10;
    const hashedPW = bcrypt.hashSync(password, salt)

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

        const payload = {
            user: {id: user.id}
        }

        jwt.sign(payload, process.env.SESSION_SECRET, { expiresIn: '1h'}, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(`Error registering user: ${err}`);
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

// route to log a user in
router.post('/login', [
    body('usernameOrEmail').exists(),
    body('password').exists()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array, message: 'An error has occured'});
    }

    const { usernameOrEmail, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]});
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or email'});
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid password'});
        }

        const payload = {
            user: {id: user.id}
        }

        jwt.sign(payload, process.env.SESSION_SECRET, { expiresIn: '1h'}, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message)
    }

});

router.get('/current-user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found'});
        }

        res.json(user);
    } catch (err) {
        console.error(`Failed to fetch user data: ${err.message}`)
        res.status(500).json({ message: 'Failed to fetch user data'});
    }
});

export default router;