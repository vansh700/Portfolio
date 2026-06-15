import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

function signAccess(id: string, role: string) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
}
function signRefresh(id: string) {
  return jwt.sign({ id }, process.env.REFRESH_SECRET as string, { expiresIn: '7d' });
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hash = await argon2.hash(password);
    const user = await prisma.user.create({
      data: { email, password: hash, name, role: 'USER' },
      select: { id: true, email: true, name: true, role: true },
    });

    const accessToken = signAccess(user.id, user.role);
    const refreshToken = signRefresh(user.id);
    return res.status(201).json({ accessToken, refreshToken, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await argon2.verify(user.password, password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccess(user.id, user.role);
    const refreshToken = signRefresh(user.id);
    return res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const accessToken = signAccess(user.id, user.role);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}
