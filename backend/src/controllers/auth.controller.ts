
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../schemas';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    // inside your login handler
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // must be true in prod (HTTPS)
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // important for cross-site requests
  maxAge: 24 * 60 * 60 * 1000,
});


    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.status(200).json({ message: 'Logged out' });
};

export const me = async (req: Request, res: Response) => {
  // req.userId is added by the authMiddleware
  // @ts-ignore
  const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, email: true }});
  res.json(user);
};