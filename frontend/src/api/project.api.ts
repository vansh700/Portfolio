import api from './axios';

export type Category = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  liveDemoUrl?: string;
  repoUrl?: string;
  techStack: string[];
  featured: boolean;
  categories: Category[];
  createdAt: string;
};

export type ProjectInput = Omit<Project, 'id' | 'categories' | 'createdAt'> & {
  categoryIds: string[];
};

// ── Public ────────────────────────────────────────────────────────────────────
export async function fetchProjects(params?: {
  search?: string;
  categoryId?: string;
  tech?: string;
}): Promise<Project[]> {
  const { data } = await api.get('/api/projects', { params });
  return data;
}

export async function fetchProjectById(id: string): Promise<Project> {
  const { data } = await api.get(`/api/projects/${id}`);
  return data;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get('/api/projects/categories');
  return data;
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function createProject(input: ProjectInput): Promise<Project> {
  const { data } = await api.post('/api/projects', input);
  return data;
}

export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<Project> {
  const { data } = await api.put(`/api/projects/${id}`, input);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/api/projects/${id}`);
}

export async function createCategory(name: string): Promise<Category> {
  const { data } = await api.post('/api/projects/categories', { name });
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/api/projects/categories/${id}`);
}
