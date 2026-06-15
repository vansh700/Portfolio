'use client';

import { useEffect, useState } from 'react';

const roles = [
  'Full-Stack Developer',
  'React Enthusiast',
  'Node.js Builder',
  'Open Source Contributor',
];

export default function HeroComponent() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: NodeJS.Timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  return (
    <section id="home" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem 1.5rem',
      overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div className="blob" style={{ width: 600, height: 600, top: '5%', left: '-10%', background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)', opacity: 0.6 }} />
      <div className="blob" style={{ width: 500, height: 500, bottom: '5%', right: '-8%', background: 'radial-gradient(circle, rgba(167,139,250,0.2), transparent 70%)', opacity: 0.5 }} />
      <div className="blob" style={{ width: 400, height: 400, top: '40%', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(56,189,248,0.1), transparent 70%)', opacity: 0.4 }} />

      {/* Content */}
      <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
        {/* Badge */}
        <div className="glass" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '0.4rem 1.1rem', borderRadius: 9999,
          marginBottom: '2rem', fontSize: '0.8rem', color: '#a5b4fc',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} className="animate-pulse" />
          Available for opportunities
        </div>

        {/* Name */}
        <h1 style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>
          Hi, I&apos;m{' '}<span className="gradient-text">Vansh Soni</span>
        </h1>

        {/* Typewriter */}
        <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.75rem)', fontWeight: 600, color: '#94a3b8', height: '2.5rem', marginBottom: '1.5rem' }}>
          <span style={{ color: '#e2e8f0' }}>{displayed}</span>
          <span className="animate-blink" style={{ color: '#6366f1', marginLeft: 2 }}>|</span>
        </div>

        {/* Bio */}
        <p style={{ maxWidth: 560, margin: '0 auto 2.5rem', fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.8 }}>
          I craft fast, beautiful &amp; scalable web applications — from idea to deployment.
          Passionate about clean code and outstanding UX.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#projects" className="btn btn-primary" style={{ fontSize: '0.95rem', padding: '0.8rem 2rem' }}>View My Work</a>
          <a href="#contact" className="btn btn-ghost" style={{ fontSize: '0.95rem', padding: '0.8rem 2rem' }}>Get In Touch</a>
          <a href="https://github.com/vansh700" target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost" style={{ fontSize: '0.95rem', padding: '0.8rem 2rem' }}>
            GitHub ↗
          </a>
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#334155' }}>Scroll</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, #6366f1, transparent)' }} />
        </div>
      </div>
    </section>
  );
}
