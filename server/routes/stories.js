import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import csrf from 'csurf';
import authMiddleware from '../middleware/auth.js';
import Story from '../models/Story.js';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// route to create a story
router.post('/create-story', [
    body('storyName').isString().isLength({ min: 3}),
    body('storySubtitle').isString().isLength({ max: 50 }),
    body('storyDesc').isString().isLength({ max: 500 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Invalid data to create story.'})
    }

    const { storyName, storySubtitle, storyDesc } = req.body;

    try {
        const newStory = new Story({
            storyName,
            storySubtitle,
            storyDesc,
            creator: req.user.id
        });

        const story = await newStory.save();
        res.json({ story, message: 'Story created successfully.'});

    } catch (err) {
        console.error('Error creating story: ', err);
        res.status(500).json({ message: 'Error creating story.', errors: err});
    }

});

// route to get all pages in the app


// route to get all pages created by a user


// route to get a single page


// route to update a page


// route to delete a page


export default router;
