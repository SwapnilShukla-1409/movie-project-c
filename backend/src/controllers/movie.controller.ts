
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { movieSchema } from '../schemas';

const prisma = new PrismaClient();


export const getMovies = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  // For Pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

 
  const search = req.query.search as string;
  const type = req.query.type as string;

  
  const where: any = {
    userId,
  };

  if (search) {
    where.title = {
      contains: search,
    };
  }

  if (type) {
    where.type = type;
  }

  try {
    const movies = await prisma.movie.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        id: 'desc', // Show newest first
      },
    });

    const totalMovies = await prisma.movie.count({ where });
    const totalPages = Math.ceil(totalMovies / limit);

    res.json({
      data: movies,
      meta: {
        totalMovies,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};


export const createMovie = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const data = movieSchema.parse(req.body);
    
    const movie = await prisma.movie.create({
      data: { ...data, userId },
    });
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// PUT /api/movies/:id
export const updateMovie = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { id } = req.params;
    const data = movieSchema.parse(req.body);

    const movie = await prisma.movie.update({
      where: { id: parseInt(id), userId }, 
      data,
    });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// DELETE /api/movies/:id
export const deleteMovie = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { id } = req.params;

    await prisma.movie.delete({
      where: { id: parseInt(id), userId }, // Ensures user can only delete their own movie
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete movie' });
  }
};