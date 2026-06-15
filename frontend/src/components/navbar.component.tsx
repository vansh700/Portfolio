'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const homeAnchors = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(8,8,18,0.85)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(99,102,241,0.1)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', fontSize: '1.2rem', fontWeight: 800 }}>
          <span className="gradient-text">Vansh</span>
          <span style={{ color: '#6366f1' }}>.</span>
        </Link>

        {/* Desktop */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hide-mobile">
          {isHome ? homeAnchors.map(({ href, label }) => (
            <a key={href} href={href} style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#64748b', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              {label}
            </a>
          )) : (
            <>
              <Link href="/" style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>Home</Link>
              <Link href="/projects" style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: pathname === '/projects' ? '#a5b4fc' : '#64748b' }}>All Projects</Link>
              <a href="/#contact" style={{ textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>Contact</a>
            </>
          )}
          <Link href="/admin" style={{
            display: 'inline-flex', alignItems: 'center', padding: '0.3rem 0.85rem', borderRadius: 9999,
            background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)',
            fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s',
          }}>
            Admin
          </Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="show-mobile"
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.5rem', padding: 4 }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="animate-fade-in">
          {isHome ? homeAnchors.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              style={{ textDecoration: 'none', fontSize: '0.9rem', color: '#94a3b8', padding: '0.4rem 0' }}>
              {label}
            </a>
          )) : (
            <Link href="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', fontSize: '0.9rem', color: '#94a3b8' }}>Home</Link>
          )}
          <Link href="/admin" onClick={() => setMenuOpen(false)}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.85rem', borderRadius: 9999, background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', width: 'fit-content' }}>
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
