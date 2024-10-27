import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import csrf from "csurf";
import authMiddleware from "../middleware/auth.js";
import Story from "../models/Story.js";
import User from '../models/User.js';
import generateSlug from "../utils/GenerateUrl.js";
import { configureUpload, getFileURL } from "../configs/uploadConfig.js";

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// route to create a story
router.post('/create-story', [
    authMiddleware,
    csrfProtection,
    (req, res, next) => {
        const upload = configureUpload();
        upload.fields([{ name: 'storyImg', maxCount: 1 }, { name: 'storyBannerImg', maxCount: 1 }])(req, res, next);
    },
    body('storyName').isString().isLength({ min: 3 }),
    body('storySubtitle').isString().isLength({ max: 50 }),
    body('storyDesc').isString().isLength({ max: 500 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: 'Invalid data to create story.' });
    }

    const { storyName, storySubtitle, storyDesc, creator } = req.body;
    const storyImg = req.files['storyImg'] ? getFileURL(req, 'storyImg') : null; // Get image URL if exists
    const storyBannerImg = req.files['storyBannerImg'] ? getFileURL(req, 'storyBannerImg') : null;

    const storySlug = generateSlug(storyName);

    try {
        const newStory = new Story({
            name: storyName,
            subtitle: storySubtitle,
            description: storyDesc,
            creator,
            slug: storySlug,
            img: storyImg,
            bannerImg: storyBannerImg
        });

        const story = await newStory.save();
        res.json({ story, message: 'Story created successfully.' });

    } catch (err) {
        console.error('Error creating story: ', err);
        res.status(500).json({ message: 'Error creating story.', errors: err });
    }
});

// route to get all pages in the app
router.get("/all-stories", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (err) {
    console.error("Error getting all stories: ", err);
    res.status(500).json({ message: err.message, errors: err });
  }
});

// route to get all the stories a user is following
router.get('/stories-followed', [
  authMiddleware,
], async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('following');

    const stories = await Story.find({
      '_id': { $in: user.following }
    }).select('name img slug');

    res.json(stories);

  } catch (err) {
    console.error("Error getting followed stories: ", err);
    res.status(500).json({ message: "Error fetching followed stories.", errors: err });
  }
});

// route to get a single page
router.get("/story/:slug", async (req, res) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug }).populate(
      "creator"
    );

    if (!story) {
      return res.status(404).json({ message: "Story not found." });
    }

    res.json(story);
  } catch (err) {
    console.error("Error creating story: ", err);
    res.status(500).json({ message: "Error fetching story.", errors: err });
  }
});

// route to update a page
router.put('/update-story/:id', [
  authMiddleware,
  csrfProtection,
  (req, res, next) => {
      const upload = configureUpload();
      upload.fields([{ name: 'storyImg', maxCount: 1 }, { name: 'storyBannerImg', maxCount: 1 }])(req, res, next);
  },
  body('storySubtitle').isString().isLength({ max: 50 }),
  body('storyDesc').isString().isLength({ max: 500 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Invalid data to update story.' });
  }

  try {
      const story = await Story.findById(req.params.id);

      if (!story) {
          return res.status(404).json({ message: 'Story not found' });
      }

      if (story.creator.toString() !== req.user.id.toString()) {
          return res.status(403).json({ message: 'Not authorized to edit this story' });
      }

      const { storySubtitle, storyDesc } = req.body;
      const storyImg = req.files?.['storyImg'] ? getFileURL(req, 'storyImg') : story.img;
      const storyBannerImg = req.files?.['storyBannerImg'] ? getFileURL(req, 'storyBannerImg') : story.bannerImg;

      const updatedStory = await Story.findByIdAndUpdate(
          req.params.id,
          {
              subtitle: storySubtitle,
              description: storyDesc,
              img: storyImg,
              bannerImg: storyBannerImg
          },
          { new: true }
      );

      res.json({ story: updatedStory, message: 'Story updated successfully.' });
  } catch (err) {
      console.error('Error updating story: ', err);
      res.status(500).json({ message: 'Error updating story.', errors: err });
  }
});

// route to delete a page
router.delete("/delete-story/:slug", [
  authMiddleware,
  csrfProtection
], async (req, res) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug }).populate('creator');

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.creator._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this story' });
    }

    await User.updateMany(
      { following: story._id },
      { $pull: { following: story._id } }
    );

    await Story.findByIdAndDelete(story._id);

    res.json({ message: 'Story deleted successfully' });
  } catch(err) {
    console.error('Error while attempting to delete Story: ', err);
    res.status(500).json({ message: 'Failed to delete Story', error: err.message });
  }
});

export default router;
