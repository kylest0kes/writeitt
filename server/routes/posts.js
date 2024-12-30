import express from "express";
import csrf from "csurf";
import authMiddleware from "../middleware/auth.js";
import { configureUpload, getFileURL } from "../configs/uploadConfig.js";
import { body, validationResult } from "express-validator";
import Post from '../models/Post.js';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import generateSlug from "../utils/GenerateUrl.js";
import Story from "../models/Story.js";

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

        const rand = Math.floor(1000 + Math.random() * 100000);
        const { postTitle, postBody, story, author } = req.body;
        let postSlug = slugify(generateSlug(postTitle), { lower: true });
        postSlug = `${postSlug}-${rand}`; 
        let postMedia = null;

        const sanitizedBody = sanitizeHtml(postBody, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 's', 'u', 'em']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ['src', 'alt'],
            }
        });

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
            body: sanitizedBody,
            media: postMedia,
            author: author,
            story: story,
            slug: postSlug
        });
        
        await newPost.populate('author');

        await newPost.save();

        await Story.findByIdAndUpdate(story, { $inc: { postCount: 1 } });
        
        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });

    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({
            message: "Server error. Could not create post.", 
            errors: error
        });
    }
});

// edit a post


// route to delete a post


// get all posts from a user


// get all posts from stories followed by a user


// get all posts for a story
router.get('/get-story-posts/:id', async (req, res) => {
    try {
        const posts = await Post.find({ story: req.params.id }).populate('author').sort({ created_at: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error when fetching all Posts: ', error);
        res.status(500).json({ message: 'Error when fetching all Posts', errors: error})
    }
});

// get all posts on the site
router.get('/get-all-posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author story').sort({ created_at: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error getting all posts: ", error);
        res.status(500).json({ message: error.message, errors: error});
    }
});

router.get('/post/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate(
            "author"
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found."});
        }

        res.status(200).json(post);
    } catch (err) {
        console.error("Error fetching Post in route.");
        res.status(500).json({ message: "Error fetching Post in route.", errors: err});
    }
});

// route to upvote or downvote a post
router.post('/post/:id/vote', [authMiddleware, csrfProtection], async (req, res) => {
    const { id } = req.params;
    const { voteType } = req.body;
    const userId = req.user.id;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const alreadyUpvoted = post.upvotes.includes(userId);
        const alreadyDownvoted = post.downvotes.includes(userId);

        post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
        post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());

        if (voteType === 'upvote') {
            if (!alreadyUpvoted) {
                post.upvotes.push(userId);
            }
        } else if (voteType === 'downvote') {
            if (!alreadyDownvoted) {
                post.downvotes.push(userId);
            }
        }

        await post.save();

        res.status(200).json({
            message: "Vote successful.",
            upvotesCount: post.upvotes.length,
            downvotesCount: post.downvotes.length
        })

    } catch (e) {
        console.error("Error when voting: ", e);
        res.status(500).json({ message: "Server error encountered when voting."});
    }
});

export default router;

