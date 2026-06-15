'use client'

const highlights = [
  { icon: '⚡', label: 'Fast Learner', desc: 'Picks up new tech quickly' },
  { icon: '🎯', label: 'Detail Oriented', desc: 'Clean, maintainable code' },
  { icon: '🚀', label: 'Passionate Builder', desc: 'Always building something' },
  { icon: '🤝', label: 'Team Player', desc: 'Thrives in collaboration' },
];

const stats = [
  { num: '10+', label: 'Projects Built' },
  { num: '5+', label: 'Technologies' },
  { num: '∞', label: 'Passion' },
];

export default function AboutComponent() {
  return (
    <section id="about" className="section">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-header">
          <span className="section-label">About Me</span>
          <h2 className="section-title">Who I <span className="gradient-text">Am</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div className="blob" style={{ width: 280, height: 280, background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent)', top: -20, left: -20, position: 'absolute' }} />
              <div style={{
                position: 'relative', width: 220, height: 220, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e1e35, #2d2b55)',
                border: '2px solid rgba(99,102,241,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem', fontWeight: 900, color: '#a5b4fc',
                boxShadow: '0 0 60px rgba(99,102,241,0.2)',
              }}>
                VS
              </div>
              <div className="glass" style={{ position: 'absolute', bottom: -12, right: -20, padding: '0.5rem 1rem', borderRadius: 12, fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc', whiteSpace: 'nowrap' }}>
                🎓 CS Student
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1rem' }}>
              Hey! I&apos;m <strong style={{ color: '#e2e8f0' }}>Vansh Soni</strong>, a passionate
              full-stack developer who loves building things for the web. I specialize in
              crafting modern, performant applications with great user experiences.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.85, marginBottom: '2rem' }}>
              When I&apos;m not coding, I&apos;m exploring new technologies, contributing to open-source
              projects, or working on my next side project. I believe in writing clean,
              well-documented code that others can build upon.
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {stats.map((s) => (
                <div key={s.label} className="glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: 14 }}>
                  <div className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{s.num}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn btn-primary">Let&apos;s Talk →</a>
          </div>
        </div>

        {/* Highlight cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {highlights.map((h) => (
            <div key={h.label} className="glass" style={{
              padding: '1.5rem', textAlign: 'center', borderRadius: 16,
              transition: 'transform 0.25s, box-shadow 0.25s',
              cursor: 'default',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(99,102,241,0.12)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{h.icon}</div>
              <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: 4, fontSize: '0.9rem' }}>{h.label}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{h.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

