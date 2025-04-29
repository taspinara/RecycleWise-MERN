// server/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Route imports
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
// Middleware imports
import auth from './middleware/auth.js';


const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Hello from RecycleWise API!');
});

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/users', auth, usersRouter);

export default app;
