import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  Building2,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  Check,
  AlertCircle,
} from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import HomepageHeroUploader from "@/components/admin/HomepageHeroUploader";
import SiteImageUploader from "@/components/admin/SiteImageUploader";
import SaveSettingsButton from "@/components/admin/SaveSettingsButton";

type SiteSettings = {
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

  chairman_name: string | null;
  chairman_bio: string | null;
  chairman_image: string | null;

  homepage_showroom_image: string | null;

};

async function getSettings(): Promise<SiteSettings | null> {
  const supabase = await createSupabaseServerClient();

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
      chairman_name,
      chairman_bio,
      chairman_image,
      homepage_showroom_image
    `)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to load site settings:", error);
    return null;
  }

  return data as SiteSettings | null;
}

async function updateSettings(formData: FormData) {
  "use server";

  const getValue = (name: string) => {
    const value = formData.get(name);

    return typeof value === "string" ? value.trim() : "";
  };

  const id = getValue("id");

  if (!id) {
    redirect("/admin/settings?saved=error");
  }

  const settings = {
    business_name: getValue("business_name"),
    tagline: getValue("tagline"),
    phone: getValue("phone"),
    whatsapp: getValue("whatsapp"),
    email: getValue("email") || null,
    address: getValue("address"),
    instagram: getValue("instagram") || null,
    facebook: getValue("facebook") || null,
    tiktok: getValue("tiktok") || null,
    opening_hours: getValue("opening_hours") || null,
    appointment_note: getValue("appointment_note") || null,

    homepage_eyebrow:
      getValue("homepage_eyebrow") || null,

    homepage_title:
      getValue("homepage_title") || null,

    homepage_description:
      getValue("homepage_description") || null,

    homepage_hero_image:
      getValue("homepage_hero_image") || null,

    chairman_name:
      getValue("chairman_name") || null,

    chairman_bio:
      getValue("chairman_bio") || null,

    chairman_image:
      getValue("chairman_image") || null,

    homepage_showroom_image:
      getValue("homepage_showroom_image") || null,

    updated_at: new Date().toISOString(),
  };

  if (
    !settings.business_name ||
    !settings.tagline ||
    !settings.phone ||
    !settings.whatsapp ||
    !settings.address
  ) {
    redirect("/admin/settings?saved=error");
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: userData,
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/admin/settings?saved=unauthorized");
  }

  const { data, error } = await supabase
    .from("site_settings")
    .update(settings)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to update site settings:",
      error
    );

    redirect("/admin/settings?saved=error");
  }

  if (!data) {
    console.error(
      "Site settings update returned no row."
    );

    redirect("/admin/settings?saved=error");
  }

  revalidatePath("/");
  revalidatePath("/vehicles");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");

  redirect("/admin/settings?saved=success");
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
  }>;
}) {
  const settings = await getSettings();

  const params = await searchParams;
  const saved = params.saved;

  if (!settings) {
    return (
      <main className="min-h-screen bg-[#f4f2ed] text-[#090b0d]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
          <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
            Site settings
          </p>

          <h1 className="mt-3 font-serif text-4xl tracking-[-0.035em]">
            Settings unavailable.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
            We couldn&apos;t load the website settings.
            Please refresh the page and try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#090b0d]">
      {/* HEADER */}

      <header className="border-b border-black/10">
        <div className="mx-auto flex min-h-20 max-w-[1400px] items-center justify-between gap-6 px-6 lg:px-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              {settings.business_name}
            </p>

            <p className="mt-1 font-serif text-xl tracking-[-0.02em]">
              Site settings
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-[9px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:text-black"
          >
            View website ↗
          </Link>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
        {/* INTRO */}

        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Website configuration
            </p>

            <h1 className="mt-3 font-serif text-4xl tracking-[-0.035em] sm:text-5xl">
              Your website.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
              Manage the information displayed across
              the {settings.business_name} digital
              showroom from one place.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-black/35">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b9913e]" />

            Changes are saved to your showroom
          </div>
        </div>

        {/* SUCCESS / ERROR */}

        {saved === "success" && (
          <div className="mb-8 flex items-center gap-3 border border-black/10 bg-white/40 px-5 py-4">
            <span className="flex h-7 w-7 items-center justify-center border border-black/10">
              <Check
                size={14}
                strokeWidth={1.5}
              />
            </span>

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em]">
                Saved successfully
              </p>

              <p className="mt-1 text-xs text-black/45">
                Your showroom settings have been updated.
              </p>
            </div>
          </div>
        )}

        {saved === "error" && (
          <div className="mb-8 flex items-center gap-3 border border-red-900/20 bg-red-50/40 px-5 py-4">
            <span className="flex h-7 w-7 items-center justify-center border border-red-900/10">
              <AlertCircle
                size={14}
                strokeWidth={1.5}
              />
            </span>

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em]">
                Could not save
              </p>

              <p className="mt-1 text-xs text-black/45">
                Please check your information and try again.
              </p>
            </div>
          </div>
        )}

        {saved === "unauthorized" && (
          <div className="mb-8 flex items-center gap-3 border border-red-900/20 bg-red-50/40 px-5 py-4">
            <span className="flex h-7 w-7 items-center justify-center border border-red-900/10">
              <AlertCircle
                size={14}
                strokeWidth={1.5}
              />
            </span>

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em]">
                Session expired
              </p>

              <p className="mt-1 text-xs text-black/45">
                Please sign in again before saving changes.
              </p>
            </div>
          </div>
        )}

        <form
          action={updateSettings}
          className="space-y-8"
        >
          <input
            type="hidden"
            name="id"
            value={settings.id}
          />

          {/* BUSINESS */}

          <section className="border border-black/10 bg-white/20">
            <SectionHeader
              icon={
                <Building2
                  size={16}
                  strokeWidth={1.2}
                />
              }
              eyebrow="01 / Business"
              title="Business information."
              description="The core identity of the dealership shown throughout the website."
            />

            <div className="grid border-t border-black/10 md:grid-cols-2">
              <Field
                label="Business name"
                name="business_name"
                defaultValue={settings.business_name}
                required
              />

              <Field
                label="Tagline"
                name="tagline"
                defaultValue={settings.tagline}
                required
              />

              <Field
                label="Phone number"
                name="phone"
                defaultValue={settings.phone}
                required
              />

              <Field
                label="WhatsApp number"
                name="whatsapp"
                defaultValue={settings.whatsapp}
                required
              />

              <Field
                label="Email address"
                name="email"
                type="email"
                defaultValue={settings.email ?? ""}
              />

              <Field
                label="Address"
                name="address"
                defaultValue={settings.address}
                required
              />
            </div>
          </section>

          {/* SHOWROOM */}

          <section className="border border-black/10 bg-white/20">
            <SectionHeader
              icon={
                <Clock3
                  size={16}
                  strokeWidth={1.2}
                />
              }
              eyebrow="02 / Showroom"
              title="Opening hours."
              description="Tell customers when your showroom is available."
            />

            <div className="grid border-t border-black/10 md:grid-cols-2">
              <Field
                label="Opening hours"
                name="opening_hours"
                defaultValue={
                  settings.opening_hours ?? ""
                }
                placeholder="Monday – Saturday · 8:00 AM – 6:00 PM"
              />

              <Field
                label="Appointment note"
                name="appointment_note"
                defaultValue={
                  settings.appointment_note ?? ""
                }
                placeholder="Appointments are requests and will be confirmed by our showroom team."
              />
            </div>
          </section>

          {/* LOCATION */}

          <section className="border border-black/10 bg-white/20">
            <SectionHeader
              icon={
                <MapPin
                  size={16}
                  strokeWidth={1.2}
                />
              }
              eyebrow="03 / Location"
              title="Showroom location."
              description="The physical location customers can use to find your dealership."
            />

            <div className="border-t border-black/10">
              <Field
                label="Full address"
                name="address"
                defaultValue={settings.address}
                required
                full
              />
            </div>
          </section>

          {/* SOCIAL */}

          <section className="border border-black/10 bg-white/20">
            <SectionHeader
              icon={
                <Globe2
                  size={16}
                  strokeWidth={1.2}
                />
              }
              eyebrow="04 / Social"
              title="Social presence."
              description="Add your official social media profiles."
            />

            <div className="grid border-t border-black/10 md:grid-cols-3">
              <Field
                label="Instagram"
                name="instagram"
                defaultValue={
                  settings.instagram ?? ""
                }
                placeholder="https://instagram.com/..."
              />

              <Field
                label="Facebook"
                name="facebook"
                defaultValue={
                  settings.facebook ?? ""
                }
                placeholder="https://facebook.com/..."
              />

              <Field
                label="TikTok"
                name="tiktok"
                defaultValue={
                  settings.tiktok ?? ""
                }
                placeholder="https://tiktok.com/@..."
              />
            </div>
          </section>

          {/* HOMEPAGE */}

          <section className="border border-black/10 bg-white/20">
            <SectionHeader
              icon={
                <Globe2
                  size={16}
                  strokeWidth={1.2}
                />
              }
              eyebrow="05 / Homepage"
              title="Homepage experience."
              description="Control the main messaging and hero imagery used to introduce the dealership."
            />

            <div className="grid border-t border-black/10 md:grid-cols-2">
              <Field
                label="Homepage eyebrow"
                name="homepage_eyebrow"
                defaultValue={
                  settings.homepage_eyebrow ?? ""
                }
                placeholder="AA Kurmawa Automobiles"
              />

              <Field
                label="Homepage title"
                name="homepage_title"
                defaultValue={
                  settings.homepage_title ?? ""
                }
                placeholder="Driven by Integrity."
              />

              <div className="md:col-span-2">
                <TextAreaField
                  label="Homepage description"
                  name="homepage_description"
                  defaultValue={
                    settings.homepage_description ?? ""
                  }
                  placeholder="A trusted destination for carefully selected vehicles..."
                />
              </div>

              <HomepageHeroUploader
                  initialUrl={
                    settings.homepage_hero_image ?? ""
                  }
                />
            </div>
          </section>


                   {/* CHAIRMAN */}

          <section className="border border-black/10 bg-white/20">
            <SectionHeader
              icon={
                <Building2
                  size={16}
                  strokeWidth={1.2}
                />
              }
              eyebrow="06 / Chairman"
              title="Leadership."
              description="Manage the chairman profile presented on the public homepage."
            />

            <div className="grid border-t border-black/10 md:grid-cols-2">
              <Field
                label="Chairman name"
                name="chairman_name"
                defaultValue={
                  settings.chairman_name ?? ""
                }
                placeholder="Auwal Ahmad"
              />

              <div className="border-b border-black/10 p-7">
                <label className="text-[8px] uppercase tracking-[0.2em] text-black/40">
                  Position
                </label>

                <p className="mt-4 border-b border-black/15 pb-3 text-sm text-black/60">
                  Chairman
                </p>

                <p className="mt-3 text-[8px] leading-5 text-black/30">
                  This is currently fixed as Chairman on
                  the public website.
                </p>
              </div>

              <div className="md:col-span-2">
                <TextAreaField
                  label="Chairman biography"
                  name="chairman_bio"
                  defaultValue={
                    settings.chairman_bio ?? ""
                  }
                  placeholder="A leader behind the vision and continued growth of AA Kurmawa Automobiles."
                />
              </div>

              <SiteImageUploader
                label="Chairman portrait"
                description="Upload the official chairman portrait displayed in the leadership section of the homepage."
                fieldName="chairman_image"
                initialUrl={
                  settings.chairman_image ?? ""
                }
                filePrefix="chairman"
                aspectClass="aspect-[4/5]"
              />
            </div>
          </section>

          {/* SHOWROOM IMAGE */}

          <section className="border border-black/10 bg-white/20">
            <SectionHeader
              icon={
                <MapPin
                  size={16}
                  strokeWidth={1.2}
                />
              }
              eyebrow="07 / Showroom"
              title="Showroom imagery."
              description="Choose the image displayed in the showroom section of the public homepage."
            />

            <div className="border-t border-black/10">
              <SiteImageUploader
                label="Homepage showroom image"
                description="Upload a strong exterior, interior or showroom photograph that represents the AA Kurmawa experience."
                fieldName="homepage_showroom_image"
                initialUrl={
                  settings.homepage_showroom_image ?? ""
                }
                filePrefix="showroom"
                aspectClass="aspect-[16/9]"
              />
            </div>
          </section>


          {/* LIVE PREVIEW */}

          <div className="border border-black/10 bg-black/[0.025] p-8 lg:p-10">
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Live identity
            </p>

            <h2 className="mt-5 max-w-2xl font-serif text-3xl leading-tight tracking-[-0.03em] sm:text-4xl">
              {settings.business_name}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
              {settings.tagline}
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <ContactPreview
                icon={
                  <Phone
                    size={14}
                    strokeWidth={1.2}
                  />
                }
                label="Phone"
                value={settings.phone}
              />

              <ContactPreview
                icon={
                  <MessageCircle
                    size={14}
                    strokeWidth={1.2}
                  />
                }
                label="WhatsApp"
                value={settings.whatsapp}
              />

              <ContactPreview
                icon={
                  <Mail
                    size={14}
                    strokeWidth={1.2}
                  />
                }
                label="Email"
                value={
                  settings.email ||
                  "Not provided"
                }
              />

              <ContactPreview
                icon={
                  <MapPin
                    size={14}
                    strokeWidth={1.2}
                  />
                }
                label="Location"
                value={settings.address}
              />
            </div>
          </div>

          {/* SAVE */}

          <div className="border border-black/10 bg-white/20 p-8">
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Save changes
            </p>

            <h2 className="mt-4 font-serif text-2xl tracking-[-0.025em]">
              Keep your showroom current.
            </h2>

            <p className="mt-3 text-xs leading-5 text-black/45">
              Changes made here are stored in your
              website database and immediately
              revalidated across the public website.
            </p>

           <SaveSettingsButton />
          </div>
        </form>

        {/* FOOTER NOTE */}

        <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-6">
          <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-black/30">
            <span className="h-1.5 w-1.5 rounded-full bg-black/20" />

            {settings.business_name}
          </div>

          <p className="text-[8px] uppercase tracking-[0.2em] text-black/25">
            Digital showroom
          </p>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-6 p-7 lg:flex-row lg:items-center lg:p-8">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-black/10 text-black/45">
            {icon}
          </span>

          <p className="text-[8px] uppercase tracking-[0.25em] text-black/40">
            {eyebrow}
          </p>
        </div>

        <h2 className="mt-5 font-serif text-2xl tracking-[-0.025em] sm:text-3xl">
          {title}
        </h2>

        <p className="mt-3 max-w-xl text-xs leading-5 text-black/45">
          {description}
        </p>
      </div>

      <div className="hidden h-px w-16 bg-black/10 lg:block" />
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required = false,
  full = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div
      className={`border-b border-black/10 p-7 ${
        full ? "md:col-span-2" : ""
      }`}
    >
      <label
        htmlFor={name}
        className="text-[8px] uppercase tracking-[0.2em] text-black/40"
      >
        {label}

        {required && (
          <span className="ml-1 text-[#9a762f]">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="mt-4 w-full border-b border-black/15 bg-transparent pb-3 text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/45"
      />
    </div>
  );
}

/* =========================================================
   TEXT AREA
========================================================= */

function TextAreaField({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
}) {
  return (
    <div className="p-7">
      <label
        htmlFor={name}
        className="text-[8px] uppercase tracking-[0.2em] text-black/40"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={4}
        className="mt-4 w-full resize-none border-b border-black/15 bg-transparent pb-3 text-sm leading-6 text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/45"
      />
    </div>
  );
}

/* =========================================================
   CONTACT PREVIEW
========================================================= */

function ContactPreview({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-black/10 pt-4">
      <div className="flex items-center gap-2 text-black/35">
        {icon}

        <span className="text-[8px] uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>

      <p className="mt-3 break-words text-xs leading-5 text-black/65">
        {value}
      </p>
    </div>
  );
}