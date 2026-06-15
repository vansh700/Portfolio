import HeroComponent from '@/components/hero.component';
import AboutComponent from '@/components/about.component';
import SkillsComponent from '@/components/skills.component';
import ExperienceComponent from '@/components/experience.component';
import EducationComponent from '@/components/education.component';
import AchievementsComponent from '@/components/achievements.component';
import FeaturedProjectsComponent from '@/components/featured-projects.component';
import ContactComponent from '@/components/contact.component';

export default function HomePage() {
  return (
    <>
      <HeroComponent />
      <AboutComponent />
      <SkillsComponent />
      <ExperienceComponent />
      <EducationComponent />
      <AchievementsComponent />
      <FeaturedProjectsComponent />
      <ContactComponent />
    </>
  );
}
