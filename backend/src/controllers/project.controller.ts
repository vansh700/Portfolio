import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// ── Public: list projects ─────────────────────────────────────────────────────
export async function getProjects(req: Request, res: Response) {
  try {
    const { search, categoryId, tech } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (categoryId) {
      where.categories = { some: { id: String(categoryId) } };
    }
    if (tech) {
      where.techStack = { has: String(tech) };
    }

    const projects = await prisma.project.findMany({
      where,
      include: { categories: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(projects);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ── Public: single project ────────────────────────────────────────────────────
export async function getProjectById(req: Request, res: Response) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { categories: true },
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.json(project);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ── Admin: create project ─────────────────────────────────────────────────────
export async function createProject(req: AuthRequest, res: Response) {
  try {
    const { title, description, imageUrl, videoUrl, liveDemoUrl, repoUrl, techStack, categoryIds, featured } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Title and description required' });

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        videoUrl,
        liveDemoUrl,
        repoUrl,
        techStack: techStack ?? [],
        featured: featured ?? false,
        categories: categoryIds?.length
          ? { connect: (categoryIds as string[]).map((id: string) => ({ id })) }
          : undefined,
      },
      include: { categories: true },
    });

    return res.status(201).json(project);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ── Admin: update project ─────────────────────────────────────────────────────
export async function updateProject(req: AuthRequest, res: Response) {
  try {
    const { categoryIds, ...rest } = req.body;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(categoryIds !== undefined && {
          categories: { set: (categoryIds as string[]).map((id: string) => ({ id })) },
        }),
      },
      include: { categories: true },
    });

    return res.json(project);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ── Admin: delete project ─────────────────────────────────────────────────────
export async function deleteProject(req: AuthRequest, res: Response) {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    return res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// ── Categories CRUD ───────────────────────────────────────────────────────────
export async function getCategories(_req: Request, res: Response) {
  const cats = await prisma.projectCategory.findMany({ orderBy: { name: 'asc' } });
  return res.json(cats);
}

export async function createCategory(req: AuthRequest, res: Response) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const cat = await prisma.projectCategory.create({ data: { name } });
    return res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteCategory(req: AuthRequest, res: Response) {
  try {
    await prisma.projectCategory.delete({ where: { id: req.params.id } });
    return res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
