'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/api/project.api';
import ProjectCard from '@/components/project.card.component';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProjectsComponent() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects-featured'],
    queryFn: () => fetchProjects(),
    select: (data) => data.filter((p) => p.featured).slice(0, 3),
  });

  // Fallback to first 3 if no featured
  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(),
    select: (data) => data.slice(0, 3),
    enabled: !isLoading && projects.length === 0,
  });

  const displayed = projects.length > 0 ? projects : allProjects;

  return (
    <section id="projects" className="py-24 px-4" style={{ background: 'rgba(15,15,26,0.5)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              Featured <span className="gradient-text">Projects</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors group"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="glass p-12 text-center rounded-2xl">
            <p className="text-5xl mb-4">🚀</p>
            <p className="text-slate-400">Projects coming soon! Check back later.</p>
            <p className="text-slate-500 text-sm mt-2">Admin can add projects via the dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
