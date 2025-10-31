// /frontend/src/lib/api.ts
import axios from 'axios';
import { z } from 'zod';
import { movieSchema, loginSchema, registerSchema } from './schemas'; // We'll create this

// Create an axios instance
const api = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  // Add additional headers for better error handling
  validateStatus: (status) => status < 500, // Resolve only if the status code is less than 500
});

// Zod types for frontend use
export type Movie = z.infer<typeof movieSchema> & { id: number };
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

// Auth API
export const register = (data: RegisterData) => api.post('/auth/register', data);
export const login = (data: LoginData) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getMe = async () => (await api.get('/auth/me')).data;

// Movie API types
export interface PaginatedMovies {
  data: Movie[];
  meta: {
    totalMovies: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
  };
}

// Movie API
export const getMovies = async ({ pageParam = 1, queryKey }: any): Promise<PaginatedMovies> => {
  const [_, { search, type }] = queryKey;
  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: '10',
  });
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  
  const res = await api.get(`/movies?${params.toString()}`);
  return res.data;
};

export const createMovie = (data: Omit<Movie, 'id'>) => api.post('/movies', data);
export const updateMovie = (id: number, data: Omit<Movie, 'id'>) => api.put(`/movies/${id}`, data);
export const deleteMovie = (id: number) => api.delete(`/movies/${id}`);

export default api;