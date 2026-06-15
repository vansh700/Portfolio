'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Pencil, LogIn } from 'lucide-react';
import {
  fetchProjects,
  fetchCategories,
  createProject,
  updateProject,
  deleteProject,
  createCategory,
  deleteCategory,
  type Project,
  type ProjectInput,
} from '@/api/project.api';
import api from '@/api/axios';

// ── Local state type ──────────────────────────────────────────────────────────
type FormState = Omit<ProjectInput, 'featured'> & { featured: boolean };

const emptyForm = (): FormState => ({
  title: '',
  description: '',
  imageUrl: '',
  videoUrl: '',
  liveDemoUrl: '',
  repoUrl: '',
  techStack: [],
  categoryIds: [],
  featured: false,
});

// ── Admin Dashboard ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const qc = useQueryClient();

  // Auth state
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  );
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Project form state
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Category form
  const [newCatName, setNewCatName] = useState('');

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(),
    enabled: !!token,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    enabled: !!token,
  });

  // ── Mutations ───────────────────────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: (input: ProjectInput) => createProject(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); resetForm(); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProjectInput> }) =>
      updateProject(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); resetForm(); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });

  const createCatMut = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); setNewCatName(''); },
  });

  const deleteCatMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function resetForm() {
    setForm(emptyForm());
    setEditingId(null);
    setTechInput('');
    setShowForm(false);
  }

  function startEdit(project: Project) {
    setForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl ?? '',
      videoUrl: project.videoUrl ?? '',
      liveDemoUrl: project.liveDemoUrl ?? '',
      repoUrl: project.repoUrl ?? '',
      techStack: project.techStack,
      categoryIds: project.categories.map((c) => c.id),
      featured: project.featured,
    });
    setEditingId(project.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateMut.mutate({ id: editingId, input: form });
    } else {
      createMut.mutate(form);
    }
  }

  function addTech() {
    const t = techInput.trim();
    if (t && !form.techStack.includes(t)) {
      setForm((f) => ({ ...f, techStack: [...f.techStack, t] }));
    }
    setTechInput('');
  }

  function removeTech(tech: string) {
    setForm((f) => ({ ...f, techStack: f.techStack.filter((t) => t !== tech) }));
  }

  function toggleCategory(id: string) {
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }));
  }

  // ── Login ───────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    try {
      const { data } = await api.post('/api/auth/login', loginForm);
      if (data.user.role !== 'ADMIN') {
        setLoginError('Access denied. Admin only.');
        return;
      }
      localStorage.setItem('accessToken', data.accessToken);
      setToken(data.accessToken);
    } catch {
      setLoginError('Invalid credentials');
    }
  }

  // ── Login Gate ──────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass p-8 w-full max-w-md animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <LogIn className="text-indigo-400" size={24} />
            <h1 className="text-2xl font-bold">Admin Login</h1>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button type="submit" className="btn-primary w-full py-3">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold gradient-text">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your projects and categories</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm()); }} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Project
          </button>
          <button
            onClick={() => { localStorage.removeItem('accessToken'); setToken(null); }}
            className="btn-danger"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Project List ── */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-300">Projects ({projects.length})</h2>
          {projects.length === 0 ? (
            <div className="glass p-8 text-center text-slate-500">No projects yet. Add one!</div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="glass p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{p.title}</h3>
                    {p.featured && <span className="badge" style={{ background: 'rgba(234,179,8,0.15)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.3)', fontSize: '10px' }}>Featured</span>}
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-1 mb-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {p.categories.map((c) => (
                      <span key={c.id} className="badge badge-primary" style={{ fontSize: '10px' }}>{c.name}</span>
                    ))}
                    {p.techStack.slice(0, 3).map((t) => (
                      <span key={t} className="badge badge-gray" style={{ fontSize: '10px' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(p)} className="p-2 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteMut.mutate(p.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Sidebar: Categories ── */}
        <div>
          <h2 className="text-lg font-semibold text-slate-300 mb-4">Categories</h2>
          <div className="glass p-4 space-y-3">
            <div className="flex gap-2">
              <input
                className="input text-sm flex-1"
                placeholder="New category…"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createCatMut.mutate(newCatName)}
              />
              <button
                onClick={() => createCatMut.mutate(newCatName)}
                className="btn-primary px-3 py-2"
                disabled={!newCatName.trim()}
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-sm text-slate-300">{c.name}</span>
                  <button
                    onClick={() => deleteCatMut.mutate(c.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Project Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Title *</label>
                  <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Image URL</label>
                  <input className="input" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Description *</label>
                <textarea className="input resize-none" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Live Demo URL</label>
                  <input className="input" value={form.liveDemoUrl} onChange={(e) => setForm((f) => ({ ...f, liveDemoUrl: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">GitHub Repo URL</label>
                  <input className="input" value={form.repoUrl} onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))} />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Tech Stack</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="input text-sm flex-1"
                    placeholder="e.g. React"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                  />
                  <button type="button" onClick={addTech} className="btn-primary px-3">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.techStack.map((t) => (
                    <span key={t} className="badge badge-gray flex items-center gap-1">
                      {t}
                      <button type="button" onClick={() => removeTech(t)} className="ml-1 text-slate-500 hover:text-red-400">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <label key={c.id} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.categoryIds.includes(c.id)}
                        onChange={() => toggleCategory(c.id)}
                        className="accent-indigo-500"
                      />
                      <span className="text-sm text-slate-300">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="accent-indigo-500"
                />
                <span className="text-sm text-slate-300">Mark as Featured</span>
              </label>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={resetForm} className="btn-danger px-6">Cancel</button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={createMut.isPending || updateMut.isPending}
                >
                  {createMut.isPending || updateMut.isPending ? 'Saving…' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
