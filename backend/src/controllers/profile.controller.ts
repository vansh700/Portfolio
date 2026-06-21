import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// ── Public: Get the owner's profile ──────────────────────────────────────────
// Returns the profile of the first ADMIN user (the portfolio owner)
export async function getProfile(_req: Request, res: Response) {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      include: { profile: true },
    });

    if (!adminUser?.profile) {
      // Return a sensible default so the frontend never crashes
      return res.json({ exists: false, profile: null });
    }

    return res.json({ exists: true, profile: adminUser.profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ── Admin: Upsert the owner's profile ────────────────────────────────────────
export async function upsertProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const {
      name,
      headline,
      bio,
      bio2,
      avatarUrl,
      location,
      email,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      resumeUrl,
      stats,
      highlights,
      skillGroups,
      extraSkills,
      experiences,
      education,
      achievements,
    } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        name,
        headline,
        bio,
        bio2,
        avatarUrl,
        location,
        email,
        githubUrl,
        linkedinUrl,
        twitterUrl,
        resumeUrl,
        stats,
        highlights,
        skillGroups,
        extraSkills,
        experiences,
        education,
        achievements,
      },
      update: {
        name,
        headline,
        bio,
        bio2,
        avatarUrl,
        location,
        email,
        githubUrl,
        linkedinUrl,
        twitterUrl,
        resumeUrl,
        stats,
        highlights,
        skillGroups,
        extraSkills,
        experiences,
        education,
        achievements,
      },
    });

    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
