'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '@/api/profile.api';

const DEFAULT_ACHIEVEMENTS = [
  {
    icon: '🏆',
    title: 'Hackathon Winner',
    issuer: 'Your Hackathon Name',
    date: '2024',
    description: 'Won 1st place among 200+ participants for building a real-time collaboration tool.',
    color: '#f59e0b',
    link: '',
  },
  {
    icon: '📜',
    title: 'Full-Stack Web Dev Certificate',
    issuer: 'Udemy / Coursera',
    date: '2023',
    description: 'Completed course covering React, Node.js, PostgreSQL, and deployment pipelines.',
    color: '#6366f1',
    link: '',
  },
  {
    icon: '⭐',
    title: '100+ GitHub Stars',
    issuer: 'Open Source',
    date: '2024',
    description: 'Accumulated GitHub stars across personal open-source packages and tools.',
    color: '#a78bfa',
    link: 'https://github.com/vansh700',
  },
  {
    icon: '💻',
    title: 'LeetCode — 300+ Problems',
    issuer: 'LeetCode',
    date: '2024',
    description: 'Solved 300+ DSA problems covering arrays, trees, graphs, and DP.',
    color: '#10b981',
    link: '',
  },
  {
    icon: '☁️',
    title: 'Cloud Practitioner',
    issuer: 'AWS',
    date: '2024',
    description: 'Foundational certification in cloud computing and AWS core services.',
    color: '#f97316',
    link: '',
  },
  {
    icon: '🤖',
    title: 'AI/ML Fundamentals',
    issuer: 'DeepLearning.AI',
    date: '2024',
    description: 'Completed training in machine learning fundamentals and neural networks.',
    color: '#38bdf8',
    link: '',
  },
];

export default function AchievementsComponent() {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  });

  const profile = data?.profile;
  const achievements = profile?.achievements ?? DEFAULT_ACHIEVEMENTS;

  return (
    <section id="achievements" className="section">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-header">
          <span className="section-label">Recognition</span>
          <h2 className="section-title">
            Achievements &amp; <span className="gradient-text">Certifications</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {achievements.map((a, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: '1.5rem',
                borderRadius: 18,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s, box-shadow 0.25s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 50px ${a.color}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {/* BG glow */}
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: a.color,
                  filter: 'blur(50px)',
                  opacity: 0.08,
                }}
              />

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${a.color}18`,
                      border: `1px solid ${a.color}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                    }}
                  >
                    {a.icon}
                  </div>
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.75rem',
                        color: '#475569',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#e2e8f0')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    >
                      View ↗
                    </a>
                  )}
                </div>

                <h3
                  style={{
                    fontWeight: 700,
                    color: '#e2e8f0',
                    marginBottom: 6,
                    fontSize: '0.95rem',
                  }}
                >
                  {a.title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span style={{ color: a.color, fontSize: '0.8rem', fontWeight: 600 }}>
                    {a.issuer}
                  </span>
                  <span style={{ color: '#334155' }}>·</span>
                  <span style={{ color: '#475569', fontSize: '0.75rem' }}>{a.date}</span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.65 }}>
                  {a.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
