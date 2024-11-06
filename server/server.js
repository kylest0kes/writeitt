import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import storyRoutes from './routes/stories.js';
import csrfRoute from './routes/csrf.js';
import { cookie } from 'express-validator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

console.log('Environment Variables Check:', {
  USE_S3: process.env.USE_S3,
  AWS_REGION: process.env.AWS_REGION ? '[SET]' : '[NOT SET]',
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY ? '[SET]' : '[NOT SET]',
  S3_BUCKET: process.env.S3_BUCKET ? '[SET]' : '[NOT SET]'
});

const app = express();
const PORT = process.env.PORT || 4200;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
.then(() => console.log('mongo connection happened yo'))
.catch(err => console.log(`Error: ${err}`));


const limit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000
});

const csrfProtection = csrf({ cookie: true });

app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
  // for use when going to prod
  // cookie: { secure: true, httpOnly: true }
}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true  // enable CORS credentials
}));
app.use(limit);
app.use(csrfProtection);

app.use(express.static(path.join(__dirname, 'client', 'build')));

if (process.env.USE_S3 !== 'true') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
}

// Content-Security-Policy middleware
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  return next();
});

// Error handling for CSRF token errors
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ message: 'Form tampered with' });
  } else {
    next(err);
  }
});

app.use('/api/stories', storyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts/', postRoutes);
app.use('/api', csrfRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`we runnin on port ${PORT}`));
