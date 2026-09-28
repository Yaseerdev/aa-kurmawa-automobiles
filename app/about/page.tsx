import { AboutHero } from "@/components/about/AboutHero";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutStandard } from "@/components/about/AboutStandard";
import { AboutChairman } from "@/components/about/AboutChairman";
import { AboutSectors } from "@/components/about/AboutSectors";
import { AboutClosing } from "@/components/about/AboutClosing";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=90";

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const heroImage =
    settings?.homepage_hero_image || FALLBACK_HERO;

  return (
    <main className="min-h-screen bg-[#f2f0eb]">
      <AboutHero heroImage={heroImage} />
      <AboutStory />
      <AboutStandard />
      <AboutChairman />
      <AboutSectors />
      <AboutClosing />

      {/* More About sections will be added here one by one. */}
    </main>
  );
}