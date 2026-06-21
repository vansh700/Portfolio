'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Pencil, LogIn, User, FolderOpen, Upload, X } from 'lucide-react';
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
import { fetchProfile, upsertProfile, type Profile } from '@/api/profile.api';
import { uploadImage } from '@/api/auth.api';
import api from '@/api/axios';
import { useToast } from '@/components/toast.component';

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'projects' | 'profile';
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
  const { addToast } = useToast();

  // ── Auth state ──────────────────────────────────────────────────────────────
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  );
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // ── Tab state ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>('projects');

  // ── Project form state ──────────────────────────────────────────────────────
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Category form ───────────────────────────────────────────────────────────
  const [newCatName, setNewCatName] = useState('');

  // ── Profile form state ──────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState<Partial<Profile>>({});
  const [profileInitialized, setProfileInitialized] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ── Data queries ─────────────────────────────────────────────────────────────
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

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: !!token,
    onSuccess: (data: { exists: boolean; profile: Profile | null }) => {
      if (!profileInitialized && data.profile) {
        setProfileForm(data.profile);
        setProfileInitialized(true);
      }
    },
  } as Parameters<typeof useQuery>[0]);

  // ── Project mutations ────────────────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: (input: ProjectInput) => createProject(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      resetForm();
      addToast('Project created successfully!', 'success');
    },
    onError: () => addToast('Failed to create project', 'error'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProjectInput> }) =>
      updateProject(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      resetForm();
      addToast('Project updated!', 'success');
    },
    onError: () => addToast('Failed to update project', 'error'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      addToast('Project deleted', 'info');
    },
    onError: () => addToast('Failed to delete project', 'error'),
  });

  const createCatMut = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      setNewCatName('');
      addToast('Category created!', 'success');
    },
    onError: () => addToast('Failed to create category', 'error'),
  });

  const deleteCatMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      addToast('Category deleted', 'info');
    },
    onError: () => addToast('Failed to delete category', 'error'),
  });

  // ── Helpers: projects ────────────────────────────────────────────────────────
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

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    try {
      const { url } = await uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
      addToast('Image uploaded!', 'success');
    } catch {
      addToast('Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleAvatarUpload(file: File) {
    setUploadingAvatar(true);
    try {
      const { url } = await uploadImage(file);
      setProfileForm((p) => ({ ...p, avatarUrl: url }));
      addToast('Avatar uploaded!', 'success');
    } catch {
      addToast('Avatar upload failed', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  }

  // ── Profile save ─────────────────────────────────────────────────────────────
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await upsertProfile(profileForm);
      qc.invalidateQueries({ queryKey: ['profile'] });
      addToast('Profile saved successfully!', 'success');
    } catch {
      addToast('Failed to save profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  }

  // JSON field helpers
  function getJsonText(value: unknown): string {
    if (!value) return '';
    return JSON.stringify(value, null, 2);
  }

  function parseJsonSafe(text: string): unknown {
    try { return JSON.parse(text); } catch { return null; }
  }

  // ── Login ────────────────────────────────────────────────────────────────────
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
      localStorage.setItem('refreshToken', data.refreshToken);
      setToken(data.accessToken);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (status === 401) {
        setLoginError(msg ?? 'Invalid credentials');
      } else if (status === 403) {
        setLoginError('Access denied. Admin only.');
      } else if (!status) {
        setLoginError('Cannot reach backend. Is the server running on port 4000?');
      } else {
        setLoginError(`Server error (${status}): ${msg ?? 'Check backend terminal for details'}`);
      }
    }
  }

  // ── Login Gate ───────────────────────────────────────────────────────────────
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

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold gradient-text">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your portfolio content</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setToken(null);
          }}
          className="btn-danger"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: '1rem',
        }}
      >
        {([
          { id: 'projects', label: 'Projects', icon: <FolderOpen size={16} /> },
          { id: 'profile', label: 'Profile', icon: <User size={16} /> },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0.5rem 1.25rem',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              background: activeTab === tab.id ? 'rgba(99,102,241,0.18)' : 'transparent',
              color: activeTab === tab.id ? '#a5b4fc' : '#64748b',
              outline: activeTab === tab.id ? '1px solid rgba(99,102,241,0.3)' : 'none',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PROJECTS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'projects' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm()); }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} /> Add Project
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Project List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-slate-300">
                Projects ({projects.length})
              </h2>
              {projects.length === 0 ? (
                <div className="glass p-8 text-center text-slate-500">No projects yet. Add one!</div>
              ) : (
                projects.map((p) => (
                  <div key={p.id} className="glass p-4 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{p.title}</h3>
                        {p.featured && (
                          <span
                            className="badge"
                            style={{
                              background: 'rgba(234,179,8,0.15)',
                              color: '#fbbf24',
                              border: '1px solid rgba(234,179,8,0.3)',
                              fontSize: '10px',
                            }}
                          >
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm line-clamp-1 mb-2">{p.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {p.categories.map((c) => (
                          <span key={c.id} className="badge badge-primary" style={{ fontSize: '10px' }}>
                            {c.name}
                          </span>
                        ))}
                        {p.techStack.slice(0, 3).map((t) => (
                          <span key={t} className="badge badge-gray" style={{ fontSize: '10px' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(p)}
                        className="p-2 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                      >
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

            {/* Categories sidebar */}
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
                    <div
                      key={c.id}
                      className="flex items-center justify-between py-1.5 border-b border-white/5"
                    >
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
        </>
      )}

      {/* ── PROFILE TAB ──────────────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="glass p-6 space-y-4" style={{ borderRadius: 18 }}>
              <h2 className="text-lg font-semibold text-slate-300 mb-2">Basic Info</h2>

              {/* Avatar */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Avatar Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {profileForm.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileForm.avatarUrl}
                      alt="Avatar"
                      style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(99,102,241,0.35)' }}
                    />
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '2px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontSize: '1.5rem' }}>
                      👤
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                      disabled={uploadingAvatar}
                    >
                      <Upload size={12} />
                      {uploadingAvatar ? 'Uploading…' : 'Upload Photo'}
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                    />
                    {profileForm.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setProfileForm((p) => ({ ...p, avatarUrl: '' }))}
                        style={{ fontSize: '0.7rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                <input className="input" value={profileForm.name ?? ''} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} placeholder="Vansh Soni" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Headline / Role</label>
                <input className="input" value={profileForm.headline ?? ''} onChange={(e) => setProfileForm((p) => ({ ...p, headline: e.target.value }))} placeholder="Full-Stack Developer" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">About Badge (e.g. 🎓 CS Student)</label>
                <input className="input" value={profileForm.bio2 ?? ''} onChange={(e) => setProfileForm((p) => ({ ...p, bio2: e.target.value }))} placeholder="🎓 CS Student" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Location</label>
                <input className="input" value={profileForm.location ?? ''} onChange={(e) => setProfileForm((p) => ({ ...p, location: e.target.value }))} placeholder="India · Open to Remote" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Contact Email</label>
                <input className="input" type="email" value={profileForm.email ?? ''} onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
              </div>
            </div>

            {/* Social Links */}
            <div className="glass p-6 space-y-4" style={{ borderRadius: 18 }}>
              <h2 className="text-lg font-semibold text-slate-300 mb-2">Social Links</h2>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">GitHub URL</label>
                <input className="input" value={profileForm.githubUrl ?? ''} onChange={(e) => setProfileForm((p) => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/username" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">LinkedIn URL</label>
                <input className="input" value={profileForm.linkedinUrl ?? ''} onChange={(e) => setProfileForm((p) => ({ ...p, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/in/username" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Twitter URL</label>
                <input className="input" value={profileForm.twitterUrl ?? ''} onChange={(e) => setProfileForm((p) => ({ ...p, twitterUrl: e.target.value }))} placeholder="https://twitter.com/username" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Resume URL</label>
                <input className="input" value={profileForm.resumeUrl ?? ''} onChange={(e) => setProfileForm((p) => ({ ...p, resumeUrl: e.target.value }))} placeholder="https://drive.google.com/..." />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Bio Paragraph 1</label>
                <textarea className="input resize-none" rows={3} value={profileForm.bio ?? ''} onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Hey! I'm Vansh..." />
              </div>
            </div>
          </div>

          {/* JSON sections */}
          {[
            {
              key: 'stats' as const,
              label: 'Stats Cards',
              placeholder: `[{"num":"10+","label":"Projects Built"},{"num":"5+","label":"Technologies"}]`,
            },
            {
              key: 'highlights' as const,
              label: 'About Highlights',
              placeholder: `[{"icon":"⚡","label":"Fast Learner","desc":"Picks up new tech quickly"}]`,
            },
            {
              key: 'skillGroups' as const,
              label: 'Skill Groups',
              placeholder: `[{"category":"Frontend","color":"#6366f1","glow":"rgba(99,102,241,0.3)","skills":[{"name":"React","icon":"⚛️","level":90}]}]`,
            },
            {
              key: 'extraSkills' as const,
              label: 'Extra Skills (array of strings)',
              placeholder: `["Redis","Cloudinary","JWT","Figma"]`,
            },
            {
              key: 'experiences' as const,
              label: 'Experience',
              placeholder: `[{"role":"Dev","company":"ACME","period":"2024","type":"Internship","color":"#6366f1","bullets":["Did X","Did Y"]}]`,
            },
            {
              key: 'education' as const,
              label: 'Education',
              placeholder: `[{"degree":"B.Tech","field":"CS","institution":"XYZ","location":"India","period":"2022-2026","grade":"8.5 CGPA","highlights":["DBMS","OS"],"color":"#6366f1"}]`,
            },
            {
              key: 'achievements' as const,
              label: 'Achievements & Certifications',
              placeholder: `[{"icon":"🏆","title":"Hackathon Winner","issuer":"XYZ","date":"2024","description":"Won 1st...","color":"#f59e0b","link":""}]`,
            },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="glass p-5" style={{ borderRadius: 18 }}>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">{label}</label>
              <p className="text-xs text-slate-500 mb-3">Edit as JSON array. Changes are validated on save.</p>
              <textarea
                className="input resize-y font-mono text-xs"
                rows={5}
                defaultValue={getJsonText(profileForm[key])}
                onChange={(e) => {
                  const parsed = parseJsonSafe(e.target.value);
                  if (parsed !== null) {
                    setProfileForm((p) => ({ ...p, [key]: parsed }));
                  }
                }}
                placeholder={placeholder}
              />
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="btn-primary px-8 py-3"
              disabled={savingProfile}
            >
              {savingProfile ? 'Saving…' : '💾 Save Profile'}
            </button>
          </div>
        </form>
      )}

      {/* ── Project Form Modal ────────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white text-xl">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Title *</label>
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Image</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      className="input text-sm flex-1"
                      placeholder="Paste URL or upload →"
                      value={form.imageUrl}
                      onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary px-3"
                      disabled={uploadingImage}
                      title="Upload to Cloudinary"
                    >
                      {uploadingImage ? '…' : <Upload size={14} />}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Description *</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Video URL (YouTube/Vimeo)</label>
                  <input
                    className="input"
                    value={form.videoUrl}
                    onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Live Demo URL</label>
                  <input
                    className="input"
                    value={form.liveDemoUrl}
                    onChange={(e) => setForm((f) => ({ ...f, liveDemoUrl: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">GitHub Repo URL</label>
                <input
                  className="input"
                  value={form.repoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))}
                />
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                  />
                  <button type="button" onClick={addTech} className="btn-primary px-3">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.techStack.map((t) => (
                    <span key={t} className="badge badge-gray flex items-center gap-1">
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTech(t)}
                        className="ml-1 text-slate-500 hover:text-red-400"
                      >
                        ✕
                      </button>
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
                <button type="button" onClick={resetForm} className="btn-danger px-6">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={createMut.isPending || updateMut.isPending}
                >
                  {createMut.isPending || updateMut.isPending
                    ? 'Saving…'
                    : editingId
                    ? 'Update'
                    : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
