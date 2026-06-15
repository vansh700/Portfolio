'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal } from 'lucide-react';
import { fetchProjects, fetchCategories } from '@/api/project.api';
import ProjectCard from '@/components/project.card.component';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTech, setSelectedTech] = useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', search, selectedCategory, selectedTech],
    queryFn: () =>
      fetchProjects({
        search: search || undefined,
        categoryId: selectedCategory || undefined,
        tech: selectedTech || undefined,
      }),
  });

  // Derive unique tech options from loaded projects
  const techOptions = Array.from(
    new Set(projects.flatMap((p) => p.techStack))
  ).sort();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-extrabold mb-2">
          <span className="gradient-text">Projects</span>
        </h1>
        <p className="text-slate-400">Things I&apos;ve built — open source &amp; otherwise.</p>
      </div>

      {/* Filters */}
      <div className="glass p-4 mb-8 flex flex-wrap gap-3 items-center">
        <SlidersHorizontal size={16} className="text-indigo-400" />

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9 text-sm"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <select
          className="input text-sm w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Tech */}
        <select
          className="input text-sm w-auto"
          value={selectedTech}
          onChange={(e) => setSelectedTech(e.target.value)}
        >
          <option value="">All Tech</option>
          {techOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {(search || selectedCategory || selectedTech) && (
          <button
            onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedTech(''); }}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Clear ✕
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton aspect-[4/3] rounded-xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </section>
  );
}
