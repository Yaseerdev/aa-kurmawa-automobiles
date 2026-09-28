import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  id: string;
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string | null;
  address: string;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  opening_hours: string | null;
  appointment_note: string | null;
  homepage_eyebrow: string | null;
  homepage_title: string | null;
  homepage_description: string | null;
  homepage_hero_image: string | null;
  updated_at: string;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select(`
      id,
      business_name,
      tagline,
      phone,
      whatsapp,
      email,
      address,
      instagram,
      facebook,
      tiktok,
      opening_hours,
      appointment_note,
      homepage_eyebrow,
      homepage_title,
      homepage_description,
      homepage_hero_image,
      updated_at
    `)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to load site settings:", error);
    return null;
  }

  return data as SiteSettings | null;
}