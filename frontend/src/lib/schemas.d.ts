import { z } from 'zod';
export declare const movieSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodString;
    director: z.ZodString;
    budget: z.ZodString;
    location: z.ZodString;
    duration: z.ZodString;
    year: z.ZodString;
    posterUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map