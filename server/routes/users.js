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

export default router;