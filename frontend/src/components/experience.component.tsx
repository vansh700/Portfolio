'use client'

const experiences = [
  {
    role: 'Full-Stack Developer Intern',
    company: 'Your Company Name',
    period: 'Jan 2025 – Present',
    type: 'Internship',
    color: '#6366f1',
    bullets: [
      'Built REST APIs with Node.js & Express serving 10k+ daily requests',
      'Developed responsive React dashboards with real-time data visualization',
      'Improved DB query performance by 40% using Prisma optimizations',
    ],
  },
  {
    role: 'Freelance Web Developer',
    company: 'Self-Employed',
    period: 'Jun 2024 – Dec 2024',
    type: 'Freelance',
    color: '#10b981',
    bullets: [
      'Delivered 5+ client websites using Next.js and TailwindCSS',
      'Integrated payment gateways and third-party APIs',
      '100% on-time delivery across all projects',
    ],
  },
  {
    role: 'Open Source Contributor',
    company: 'GitHub Community',
    period: '2023 – Present',
    type: 'Open Source',
    color: '#a78bfa',
    bullets: [
      'Contributed bug fixes and features to popular repositories',
      'Maintained personal packages with 100+ GitHub stars',
    ],
  },
];

export default function ExperienceComponent() {
  return (
    <section id="experience" className="section">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="section-header">
          <span className="section-label">Work History</span>
          <h2 className="section-title"><span className="gradient-text">Experience</span></h2>
        </div>

        <div style={{ position: 'relative' }}>
          <div className="timeline-line" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {experiences.map((exp, i) => (
              <div key={i} style={{ display: 'flex', gap: '2rem' }}>
                {/* Dot */}
                <div style={{ flexShrink: 0, position: 'relative' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: `${exp.color}18`,
                    border: `2px solid ${exp.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', fontWeight: 700, color: exp.color,
                    boxShadow: `0 0 20px ${exp.color}35`,
                    position: 'relative', zIndex: 1,
                  }}>
                    {i + 1}
                  </div>
                </div>

                {/* Card */}
                <div className="glass" style={{
                  flex: 1, padding: '1.5rem', borderRadius: 18,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  marginBottom: 4,
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px ${exp.color}18`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{exp.role}</h3>
                      <p style={{ color: exp.color, fontWeight: 600, fontSize: '0.875rem' }}>{exp.company}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge" style={{ background: `${exp.color}18`, color: exp.color, border: `1px solid ${exp.color}35`, marginBottom: 4 }}>
                        {exp.type}
                      </span>
                      <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4 }}>{exp.period}</p>
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} style={{ display: 'flex', gap: 8, fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
                        <span style={{ color: exp.color, flexShrink: 0, marginTop: 1 }}>▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

