import express from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import csrf from 'csurf';

import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import { configureUpload, getFileURL } from '../configs/uploadConfig.js';

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

// route to get the current user
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

        res.json({
            message: 'Gender updated successfully',
            user: user
        });
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
        const user = await User.findByIdAndUpdate(req.user.id, { phoneNumber }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Phone numbner updated successfully',
            user: user
        });

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

        res.json({
            message: 'Email updated successfully',
            user: user
        });

    } catch (err) {
        console.error('Failed to update display name: ', err);
        res.status(500).json({ message: 'Failed to update display name.'});
    }
});

// route to update user email
router.put('/update-email', [
    authMiddleware,
    csrfProtection,
    body('newEmail').isEmail().normalizeEmail(),
    body('password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Invalid email or password value' });
    }

    const { newEmail, password } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        user.email = newEmail;
        await user.save();

        res.json({
            message: 'Email updated successfully',
            user: user
        });

    } catch (err) {
        console.error('Failed to update email: ', err);
        res.status(500).json({ message: 'Failed to update email.'});
    }
});

// route to update user password
router.put('/update-password', [
    authMiddleware,
    csrfProtection,
    body('password').exists(),
    body('newPassword').exists().isLength({ min: 10 }),
    body('confirmPassword').exists().isLength({ min: 10 })
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Invalid password data' });
    }

    const { password, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const salt = 10;
        const hashedPW = bcrypt.hashSync(newPassword, salt);

        user.password = hashedPW;
        await user.save();

        res.json({
            message: 'Password updated successfully',
            user: user
        });

    } catch (err) {
        console.error('Failed to update password: ', err);
        res.status(500).json({ message: 'Failed to update password.'});
    }

});

// route for uploading avatar image
router.put('/update-avatar', [
    authMiddleware,
    csrfProtection,
    (req, res, next) => {
        const upload = configureUpload();
        upload.single('avatar')(req, res, next);
    }
], async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }

    const fileUrl = getFileURL(req);

    try {
        const user = await User.findByIdAndUpdate(req.user.id, { userImg: fileUrl }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Image updated successfully',
            user: user
        });


    } catch (err) {
        console.error('Failed to update image: ', err);
        res.status(500).json({ message: 'Failed to update image.', error: err.message});
    }
});

// route for deleting account
router.put('/delete-account', [
    authMiddleware,
    csrfProtection,
    body('password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Invalid password value'});
    }

    const { password } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.'});
        }

        await User.findByIdAndDelete(req.user.id);

        res.json({ message: 'Account deleted successfully.'});

    } catch (err) {
        console.error('Failed to delete account: ', err);
        res.status(500).json({ message: 'Failed to delete account.', error: err.message });
    }


});

export default router;
