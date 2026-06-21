'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProjectById } from '@/api/project.api';
import { ExternalLink, GitBranch, ArrowLeft, Tag, Code2, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { id } = use(params);

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="skeleton h-8 w-40 rounded-lg mb-8" />
        <div className="skeleton aspect-video rounded-2xl mb-8" />
        <div className="skeleton h-10 w-3/4 rounded-lg mb-4" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-5/6 rounded mb-2" />
        <div className="skeleton h-4 w-4/6 rounded" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-white mb-2">Project Not Found</h1>
        <p className="text-slate-400 mb-8">This project may have been removed or doesn&apos;t exist.</p>
        <Link href="/projects" className="btn btn-primary">← Back to Projects</Link>
      </div>
    );
  }

  const isYouTube = project.videoUrl?.includes('youtube') || project.videoUrl?.includes('youtu.be');
  const isVimeo = project.videoUrl?.includes('vimeo');

  function getEmbedUrl(url: string): string {
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      {/* Back */}
      <Link
        href="/projects"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: '#64748b',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          marginBottom: '2rem',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#64748b')}
      >
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Hero image / video */}
      {project.videoUrl && (isYouTube || isVimeo) ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: '2rem',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <iframe
            src={getEmbedUrl(project.videoUrl)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      ) : project.imageUrl ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: '2rem',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <Image src={project.imageUrl} alt={project.title} fill style={{ objectFit: 'cover' }} />
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 20,
            background: 'linear-gradient(135deg, #1e1e35, #2d2b55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          🚀
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '0.875rem' }}>
          {project.categories.map((cat) => (
            <span key={cat.id} className="badge badge-primary">{cat.name}</span>
          ))}
          {project.featured && (
            <span
              className="badge"
              style={{ background: 'rgba(234,179,8,0.12)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.25)' }}
            >
              ⭐ Featured
            </span>
          )}
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, color: '#e2e8f0', lineHeight: 1.2, marginBottom: '0.5rem' }}>
          {project.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: '0.8rem' }}>
          <Calendar size={13} />
          {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
        {/* Left: description + tech */}
        <div>
          <div className="glass" style={{ padding: '1.75rem', borderRadius: 18, marginBottom: '1.5rem' }}>
            <p style={{ color: '#94a3b8', lineHeight: 1.85, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
              {project.description}
            </p>
          </div>

          {project.techStack.length > 0 && (
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                <Code2 size={16} color="#6366f1" />
                <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Tech Stack
                </h2>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {project.techStack.map((tech) => (
                  <span key={tech} className="badge badge-gray">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: links sidebar */}
        <div style={{ minWidth: 160 }}>
          <div className="glass" style={{ padding: '1.25rem', borderRadius: 18, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>Links</p>
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: '0.825rem', padding: '0.6rem 1rem' }}
              >
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                  padding: '0.6rem 1rem', borderRadius: 10, fontSize: '0.825rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8', textDecoration: 'none', fontWeight: 600,
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8'; }}
              >
                <GitBranch size={14} /> GitHub
              </a>
            )}
            {!project.liveDemoUrl && !project.repoUrl && (
              <p style={{ color: '#475569', fontSize: '0.8rem', textAlign: 'center' }}>No links yet</p>
            )}

            {/* Categories */}
            {project.categories.length > 0 && (
              <>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0.25rem 0' }} />
                <p style={{ fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Categories</p>
                {project.categories.map((c) => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: '0.8rem' }}>
                    <Tag size={12} color="#6366f1" /> {c.name}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
