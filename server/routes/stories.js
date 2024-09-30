import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import csrf from 'csurf';
import authMiddleware from '../middleware/auth.js';
import Story from '../models/Story.js';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// route to create a story


// route to get all pages in the app


// route to get all pages created by a user


// route to get a single page


// route to update a page


// route to delete a page


export default router;
