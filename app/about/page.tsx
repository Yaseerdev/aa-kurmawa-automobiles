import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutStandard } from "@/components/about/AboutStandard";
import { AboutChairman } from "@/components/about/AboutChairman";
import { AboutClosing } from "@/components/about/AboutClosing";
import { SiteFooter } from "@/components/SiteFooter";
import { getSiteSettings } from "@/lib/queries/site-settings";

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <main className="min-h-screen bg-[#f2f0eb]">
        <AboutHero
          heroImage={settings?.homepage_hero_image ?? ""}
        />

        <AboutStory
          storyImage={settings?.about_story_image}
        />

        <AboutStandard />

        <AboutChairman
          name={settings?.chairman_name}
          image={settings?.chairman_image}
          bio={settings?.chairman_bio}
        />
          
        <AboutClosing />
      </main>

      <SiteFooter />
    </>
  );
}