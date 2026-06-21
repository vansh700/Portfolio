import api from './axios';

export type SkillItem = { name: string; icon: string; level: number };
export type SkillGroup = { category: string; color: string; glow: string; skills: SkillItem[] };

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  type: string;
  color: string;
  bullets: string[];
};

export type EducationItem = {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  grade: string;
  highlights: string[];
  color: string;
};

export type AchievementItem = {
  icon: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  color: string;
  link: string;
};

export type StatItem = { num: string; label: string };
export type HighlightItem = { icon: string; label: string; desc: string };

export type Profile = {
  id: string;
  userId: string;
  name: string | null;
  headline: string | null;
  bio: string | null;
  bio2: string | null;
  avatarUrl: string | null;
  location: string | null;
  email: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  resumeUrl: string | null;
  stats: StatItem[] | null;
  highlights: HighlightItem[] | null;
  skillGroups: SkillGroup[] | null;
  extraSkills: string[] | null;
  experiences: ExperienceItem[] | null;
  education: EducationItem[] | null;
  achievements: AchievementItem[] | null;
};

export type ProfileResponse = { exists: boolean; profile: Profile | null };

// ── Public ────────────────────────────────────────────────────────────────────
export async function fetchProfile(): Promise<ProfileResponse> {
  const { data } = await api.get('/api/profile');
  return data;
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function upsertProfile(input: Partial<Profile>): Promise<Profile> {
  const { data } = await api.put('/api/profile', input);
  return data;
}
