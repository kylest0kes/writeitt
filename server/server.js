import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/users.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 4200;

app.use(bodyParser.json());

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
.then(() => console.log('mongo connection happened yo'))
.catch(err => console.log(`Error: ${err}`));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use('/api/users', userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`we runnin on port ${PORT}`));