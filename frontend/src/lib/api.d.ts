import { z } from 'zod';
import { movieSchema, loginSchema, registerSchema } from './schemas';
declare const api: import("axios").AxiosInstance;
export type Movie = z.infer<typeof movieSchema> & {
    id: number;
};
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export declare const register: (data: RegisterData) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const login: (data: LoginData) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const logout: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const getMe: () => Promise<any>;
export interface PaginatedMovies {
    data: Movie[];
    meta: {
        totalMovies: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
    };
}
export declare const getMovies: ({ pageParam, queryKey }: any) => Promise<PaginatedMovies>;
export declare const createMovie: (data: Omit<Movie, "id">) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const updateMovie: (id: number, data: Omit<Movie, "id">) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const deleteMovie: (id: number) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export default api;
//# sourceMappingURL=api.d.ts.map