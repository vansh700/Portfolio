'use client';

import { useState } from 'react';
import { Mail, Send } from 'lucide-react';

const socials = [
  { emoji: '🐙', label: 'GitHub', href: 'https://github.com/vansh700', color: '#e2e8f0' },
  { emoji: '💼', label: 'LinkedIn', href: 'https://www.linkedin.com/in/vansh-soni-85921129a/', color: '#0ea5e9' },
  { emoji: '📧', label: 'Email', href: 'mailto:vanshsoni513@gmail.com', color: '#6366f1' },
  { emoji: '🐦', label: 'Twitter', href: 'https://twitter.com/vansh700', color: '#38bdf8' },
];

export default function ContactComponent() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:vanshsoni513@gmail.com?subject=${subject}&body=${body}`);
    setTimeout(() => { setSending(false); setSent(true); }, 800);
  }

  return (
    <section id="contact" className="section section-alt">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="section-header">
          <span className="section-label">Say Hello</span>
          <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
          <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '1rem' }}>
            Have a project in mind? I&apos;m always open to great conversations and opportunities.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Left — info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="glass" style={{ padding: '1.75rem', borderRadius: 18 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '1rem' }}>Let&apos;s work together</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Open to freelance projects, full-time roles, and exciting collaborations. I usually respond within 24 hours.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Mail size={15} color="#6366f1" />
                  <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>vanshsoni513@gmail.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.875rem' }}>📍</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>India · Open to Remote</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} className="animate-pulse" />
                  <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Available for opportunities</span>
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding: '1.75rem', borderRadius: 18 }}>
              <h3 style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>Find me on</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '0.75rem', borderRadius: 12, textDecoration: 'none',
                      background: `${s.color}08`, border: `1px solid ${s.color}20`,
                      transition: 'transform 0.2s, background 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.background = `${s.color}15`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.background = `${s.color}08`; }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{s.emoji}</span>
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1' }}>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="glass" style={{ padding: '2rem', borderRadius: 18 }}>
            {sent ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>I&apos;ll get back to you soon.</p>
                <button className="btn btn-primary" onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: 6 }}>Your Name</label>
                  <input className="input" placeholder="John Doe" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input className="input" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: 6 }}>Message</label>
                  <textarea className="input" rows={5} style={{ resize: 'none' }} placeholder="Tell me about your project or just say hi…" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={sending}>
                  <Send size={15} />
                  {sending ? 'Opening Mail…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p style={{ color: '#334155', fontSize: '0.85rem' }}>
          Built with ❤️ by <span style={{ color: '#6366f1' }}>Vansh Soni</span> · Next.js + TailwindCSS · 2025
        </p>
      </div>
    </section>
  );
}
