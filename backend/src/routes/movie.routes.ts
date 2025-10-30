// /backend/src/routes/movie.routes.ts
import { Router } from 'express';
import {
  createMovie,
  deleteMovie,
  getMovies,
  updateMovie,
} from '../controllers/movie.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All movie routes are protected
router.use(authMiddleware);

router.post('/', createMovie);
router.get('/', getMovies); // For infinite scroll
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

export const movieRouter = router;