import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Instagram,
  MapPin,
  Phone,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/lib/supabase";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCollection } from "@/components/home/HomeCollection";
import { HomeStandard } from "@/components/home/HomeStandard";
import { HomeChairman } from "@/components/home/HomeChairman";
import { HomeBeyondAutomotive } from "@/components/home/HomeBeyondAutomotive";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeJournal } from "@/components/home/HomeJournal";
import { HomeShowroom } from "@/components/home/HomeShowroom";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";

export const dynamic = "force-dynamic";

type SiteSettings = {
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  address: string;
  opening_hours: string | null;
  appointment_note: string | null;

  homepage_eyebrow: string | null;
  homepage_title: string | null;
  homepage_description: string | null;
  homepage_hero_image: string | null;
  homepage_showroom_image: string | null;

  chairman_name: string | null;
  chairman_image: string | null;
  chairman_bio: string | null;
};

type Service = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  sort_order: number;
  featured: boolean;
};

async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select(`
      business_name,
      tagline,
      phone,
      whatsapp,
      email,
      address,
      opening_hours,
      appointment_note,
      homepage_eyebrow,
      homepage_title,
      homepage_description,
      homepage_hero_image,
      homepage_showroom_image,
      chairman_name,
      chairman_image,
      chairman_bio
`)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to load site settings:", error);
  }

  return {
    business_name:
      data?.business_name ?? "AA Kurmawa Automobiles",

    tagline:
      data?.tagline ??
      "Driven by Integrity, Powered by Excellence",

    phone:
      data?.phone ?? "07077773521",

    whatsapp:
      data?.whatsapp ?? "2347077773521",

    email:
      data?.email ?? null,

    address:
      data?.address ??
      "No. 346 Abdullahi Bayero Road, Kano, Nigeria",

    opening_hours:
      data?.opening_hours ?? null,

    appointment_note:
      data?.appointment_note ??
      "Appointments are requests and will be confirmed by our showroom team.",

    homepage_eyebrow:
      data?.homepage_eyebrow ??
      "AA Kurmawa Automobiles · Kano, Nigeria",

    homepage_title:
      data?.homepage_title ??
      "Driven by Integrity.",

    homepage_description:
      data?.homepage_description ??
      "A trusted destination for carefully selected vehicles, professional service and a premium showroom experience.",

     homepage_hero_image: data?.homepage_hero_image ?? "",
     
      homepage_showroom_image:
      data?.homepage_showroom_image ??
      "https://images.unsplash.com/photo-1562141961-8d17a1e7b7d4?auto=format&fit=crop&w=2400&q=90",

     chairman_name:
      data?.chairman_name ?? "Auwal Ahmad",

    chairman_image:
      data?.chairman_image ?? "/chairman-auwal-ahmad.jpg",

    chairman_bio:
      data?.chairman_bio ??
      "A leader behind the vision and continued growth of AA Kurmawa Automobiles.",

  };
}

async function getPublishedServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select(`
      id,
      title,
      slug,
      description,
      category,
      sort_order,
      featured
    `)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load services:", error);
    return [];
  }

  return (data ?? []) as Service[];
}

export default async function Home() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
  ]);

  const businessName = settings.business_name;
  const phone = settings.phone;
  const address = settings.address;

  return (
<>

    <main className="bg-[#090b0d]">

          {/* =========================================================
          HERO
      ========================================================= */}

      <HomeHero
        businessName={businessName}
        eyebrow={settings.homepage_eyebrow ?? "AA Kurmawa Automobiles · Kano, Nigeria"}
        title={settings.homepage_title ?? "Driven by Integrity."}
        description={
          settings.homepage_description ??
          "A trusted destination for carefully selected vehicles, professional service and a premium showroom experience."
        }
      heroImage={settings.homepage_hero_image}
      />

     
      <HomeCollection />

      <HomeStandard />

      <HomeChairman
        name={settings.chairman_name}
        image={settings.chairman_image}
        bio={settings.chairman_bio}
      />

      <HomeBeyondAutomotive />

      <HomeServices services={services} />

      <HomeJournal />

      <HomeShowroom
      businessName={businessName}
      address={settings.address}
      phone={settings.phone}
      openingHours={settings.opening_hours}
      showroomImage={
        settings.homepage_showroom_image ??
        "https://images.unsplash.com/photo-1562141961-8d17a1e7b7d4?auto=format&fit=crop&w=2400&q=90"
      }
    />

    <HomeFinalCTA phone={settings.phone} />

  
     
    </main>

    <SiteFooter />
</>

  );
}
