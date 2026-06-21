'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '@/api/profile.api';

const DEFAULT_SKILL_GROUPS = [
  {
    category: 'Frontend',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.3)',
    skills: [
      { name: 'React', icon: '⚛️', level: 90 },
      { name: 'Next.js', icon: '▲', level: 85 },
      { name: 'TypeScript', icon: '🔷', level: 80 },
      { name: 'TailwindCSS', icon: '🎨', level: 88 },
      { name: 'HTML / CSS', icon: '🌐', level: 95 },
    ],
  },
  {
    category: 'Backend',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.3)',
    skills: [
      { name: 'Node.js', icon: '🟢', level: 85 },
      { name: 'Express', icon: '🚂', level: 82 },
      { name: 'PostgreSQL', icon: '🐘', level: 75 },
      { name: 'Prisma ORM', icon: '🔺', level: 78 },
      { name: 'REST APIs', icon: '🔗', level: 90 },
    ],
  },
  {
    category: 'Tools & Cloud',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    skills: [
      { name: 'Git & GitHub', icon: '🐙', level: 88 },
      { name: 'Docker', icon: '🐳', level: 65 },
      { name: 'Vercel / Railway', icon: '☁️', level: 85 },
      { name: 'Python', icon: '🐍', level: 70 },
      { name: 'Linux', icon: '🐧', level: 72 },
    ],
  },
];

const DEFAULT_EXTRAS = ['Redis', 'Cloudinary', 'Supabase', 'JWT', 'Figma', 'Postman', 'VS Code', 'Vim', 'CI/CD'];

export default function SkillsComponent() {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  });

  const profile = data?.profile;
  const skillGroups = profile?.skillGroups ?? DEFAULT_SKILL_GROUPS;
  const extras = profile?.extraSkills ?? DEFAULT_EXTRAS;

  return (
    <section id="skills" className="section section-alt">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-header">
          <span className="section-label">What I Know</span>
          <h2 className="section-title">
            Skills &amp; <span className="gradient-text">Technologies</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="glass"
              style={{ padding: '1.75rem', borderRadius: 18, position: 'relative', overflow: 'hidden' }}
            >
              {/* Glow accent */}
              <div
                style={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: group.glow,
                  filter: 'blur(40px)',
                  opacity: 0.4,
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: '1.5rem',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: group.color,
                    boxShadow: `0 0 12px ${group.color}`,
                  }}
                />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0' }}>
                  {group.category}
                </h3>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                }}
              >
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.9rem' }}>{skill.icon}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1' }}>
                          {skill.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${skill.level}%`,
                          background: `linear-gradient(90deg, ${group.color}, ${group.color}bb)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Extra tech */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#475569',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Also worked with
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {extras.map((t) => (
              <span key={t} className="badge badge-gray">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
