import express from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import csrf from 'csurf'; 

import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// route to register a new user
router.post('/register', [ 
        csrfProtection,
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
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        });

    } catch (err) {
        console.error(`Error registering user: ${err}`);
        res.status(500).json({ message: 'Error :('});
    }
});

// route to check if username or email exists already
router.post('/check', csrfProtection, async (req, res) => {
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
    csrfProtection,
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
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
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

// route to update user gender
router.put('/update-gender', [
    authMiddleware, 
    csrfProtection, 
    body('gender').isString().isLength({ min: 1})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Invalid gender value' });
    }

    const { gender } = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.user.id, { gender }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Gender updated successfully', user });
    } catch (err) {
        console.error('Failed to update gender: ', err);
        res.status(500).json({ message: 'Failed to update gender.'});
    }
});

// route to update user phone number
router.put('/update-phone', [
    authMiddleware,
    csrfProtection,
    body('phoneNumber').isMobilePhone()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Invalid phone number value' });
    }

    const { phoneNumber } = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.user.id, { phoneNumber }, { new: true});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Phone number updated successfully', user});

    } catch (err) {
        console.error('Failed to update phone number: ', err);
        res.status(500).json({ message: 'Failed to update phone number.'});
    }
});

// route to update user displayname
router.put('/update-displayname', [
    authMiddleware,
    csrfProtection,
    body('displayName').isString().isLength({ min: 3, max: 30})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Invalid display name value' });
    }

    const { displayName } = req.body;
    
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { displayName }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Display name updated successfully', user});

    } catch (err) {
        console.error('Failed to update display name: ', err);
        res.status(500).json({ message: 'Failed to update phone number.'});
    }

});

export default router;