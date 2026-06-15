'use client'

import Image from 'next/image';
import { ExternalLink, GitBranch } from 'lucide-react';
import type { Project } from '@/api/project.api';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article style={{
      background: 'rgba(15,15,30,0.65)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(99,102,241,0.18)',
      borderRadius: 18,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
    }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-6px)';
        el.style.boxShadow = '0 24px 60px rgba(99,102,241,0.18)';
        el.style.borderColor = 'rgba(99,102,241,0.45)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'none';
        el.style.boxShadow = 'none';
        el.style.borderColor = 'rgba(99,102,241,0.18)';
      }}
    >
      {/* Thumbnail */}
      {project.imageUrl ? (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
          <Image src={project.imageUrl} alt={project.title} fill style={{ objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{
          width: '100%', aspectRatio: '16/9',
          background: 'linear-gradient(135deg, #1e1e35, #2d2b55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem',
        }}>
          🚀
        </div>
      )}

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Badges row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '0.75rem' }}>
          {project.categories.map((cat) => (
            <span key={cat.id} className="badge badge-primary">{cat.name}</span>
          ))}
          {project.featured && (
            <span className="badge" style={{ background: 'rgba(234,179,8,0.12)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.25)' }}>
              ⭐ Featured
            </span>
          )}
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {project.title}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.855rem', lineHeight: 1.7, flex: 1, marginBottom: '1rem',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: '1rem' }}>
          {project.techStack.map((tech) => (
            <span key={tech} className="badge badge-gray">{tech}</span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {project.liveDemoUrl && (
            <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.825rem', color: '#818cf8', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#a5b4fc')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#818cf8')}
            >
              <ExternalLink size={13} /> Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.825rem', color: '#64748b', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              <GitBranch size={13} /> GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

