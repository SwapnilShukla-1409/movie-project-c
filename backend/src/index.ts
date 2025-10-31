// /backend/src/index.ts
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes';
import { movieRouter } from './routes/movie.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests from localhost:5173 and localhost:5174
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174','https://movie-project-c.netlify.app/'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/movies', movieRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.send('Server is healthy!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});