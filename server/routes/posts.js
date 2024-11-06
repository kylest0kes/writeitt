import express from "express";
import csrf from "csurf";
import authMiddleware from "../middleware/auth.js";
import { configureUpload, getFileURL } from "../configs/uploadConfig.js";
import { body, validationResult } from "express-validator";
import Post from '../models/Post.js';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// route to create a post
router.post('/create-post', [
    authMiddleware,
    csrfProtection,
    (req, res, next) => {
        const upload = configureUpload();
        upload.single('postMedia')(req, res, next);
    },
    body('postTitle').isString().isLength({ max: 300, min: 5 })
        .withMessage('Title must be between 5 and 300 characters'),
    body('postBody').isString().isLength({ max: 30000 })
        .withMessage('Body must not exceed 30000 characters'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data to create post"
            });
        }

        const { postTitle, postBody, story, author } = req.body;
        let postMedia = null;

        if (req.file) {
            try {
                postMedia = await getFileURL(req.file);
            } catch (fileError) {
                console.error('File URL generation error:', fileError);
                return res.status(500).json({
                    message: "Error processing uploaded file"
                });
            }
        }

        const newPost = new Post({
            title: postTitle,
            body: postBody,
            media: postMedia,
            author: author || req.user_id,
            story: story
        });

        await newPost.save();
        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });

    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({
            message: "Server error. Could not create post."
        });
    }
});

// edit a post


// route to delete a post


// get all posts from a user


// get all posts for a story


export default router;
