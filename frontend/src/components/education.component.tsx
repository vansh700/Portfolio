'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '@/api/profile.api';

const DEFAULT_EDUCATION = [
  {
    degree: 'Bachelor of Technology',
    field: 'Computer Science & Engineering',
    institution: 'Your University Name',
    location: 'India',
    period: '2022 – 2026',
    grade: 'CGPA: 8.5 / 10',
    highlights: ['Data Structures', 'DBMS', 'Web Technologies', 'OS', 'Computer Networks'],
    color: '#6366f1',
  },
  {
    degree: 'Class XII — PCM',
    field: 'Physics · Chemistry · Mathematics',
    institution: 'Your School Name',
    location: 'India',
    period: '2020 – 2022',
    grade: '90%',
    highlights: [],
    color: '#a78bfa',
  },
];

export default function EducationComponent() {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  });

  const profile = data?.profile;
  const education = profile?.education ?? DEFAULT_EDUCATION;

  return (
    <section id="education" className="section section-alt">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="section-header">
          <span className="section-label">Background</span>
          <h2 className="section-title">
            <span className="gradient-text">Education</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {education.map((edu, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: '2rem',
                borderRadius: 20,
                borderLeft: `3px solid ${edu.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px ${edu.color}15`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      background: `${edu.color}18`,
                      border: `1px solid ${edu.color}35`,
                    }}
                  >
                    🎓
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#e2e8f0',
                        marginBottom: 4,
                      }}
                    >
                      {edu.degree}
                    </h3>
                    <p style={{ color: edu.color, fontWeight: 600, marginBottom: 4, fontSize: '0.9rem' }}>
                      {edu.field}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {edu.institution} · {edu.location}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    className="badge"
                    style={{
                      background: `${edu.color}15`,
                      color: edu.color,
                      border: `1px solid ${edu.color}30`,
                      display: 'block',
                      marginBottom: 6,
                    }}
                  >
                    {edu.period}
                  </span>
                  <span style={{ color: '#4ade80', fontSize: '0.875rem', fontWeight: 700 }}>
                    {edu.grade}
                  </span>
                </div>
              </div>

              {edu.highlights.length > 0 && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.68rem',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Key Subjects
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {edu.highlights.map((h) => (
                      <span key={h} className="badge badge-gray">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
