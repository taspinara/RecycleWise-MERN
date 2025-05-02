// server/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Route imports
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import scanRouter from './routes/scan.js';
import leaderboardRouter from './routes/leaderboard.js';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';

// Middleware imports
import auth from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('Hello from RecycleWise API!'));

// Public
app.use('/api/auth', authRouter);
app.use('/api/leaderboard', leaderboardRouter);

// Protected
app.use('/api/users', auth, usersRouter);
app.use('/api/scan', scanRouter);

// Blog CRUD
app.use('/api/posts', postsRouter);
app.use('/api/posts/:id/comments', commentsRouter);

export default app;
