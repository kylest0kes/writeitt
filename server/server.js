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
import userRoutes from './routes/users.js';
import csrfRoute from './routes/csrf.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 4200;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
.then(() => console.log('mongo connection happened yo'))
.catch(err => console.log(`Error: ${err}`));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const limit = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 1000
// });

// const csrfProtection = csrf({ cookie: true });

// app.set('trust proxy', true);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
  // for use when going to prod
  // cookie: { secure: true, httpOnly: true }
}));

app.use(cors());
// app.use(limit);

app.use(express.static(path.join(__dirname, 'client', 'build')));

// Content-Security-Policy middleware
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  return next();
});

// app.use(csrfProtection);

app.use('/api/users', userRoutes);
// app.use('/api', csrfRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`we runnin on port ${PORT}`));