import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/Reveal";
import { supabase } from "@/lib/supabase";

type Service = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  category: string | null;
  cta_label: string | null;
  cta_url: string | null;
  published: boolean;
};

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getService(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select(
      `
        id,
        slug,
        title,
        short_description,
        description,
        image_url,
        category,
        cta_label,
        cta_url,
        published
      `
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Error loading service:", error);
    return null;
  }

  return data;
}

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { slug } = await params;

  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const description =
    service.description ||
    service.short_description ||
    "Professional solutions from AA Kurmawa Automobiles.";

  const ctaLabel = service.cta_label || "Get started";

  const ctaHref =
    service.cta_url ||
    "/#appointment";

  return (
    <main className="min-h-screen bg-[#f2f0eb] text-black">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="mx-auto max-w-[1600px] px-5 pb-16 pt-6 sm:pb-20 md:px-10 md:pt-8 lg:px-14 lg:pb-24">
          {/* Top navigation */}
          <Reveal>
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 text-[8px] font-medium uppercase tracking-[0.25em] text-white/55 transition-colors hover:text-white"
              >
                <ArrowLeft
                  size={13}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                All services
              </Link>

              <p className="text-[8px] uppercase tracking-[0.25em] text-white/30">
                AA Kurmawa Automobiles
              </p>
            </div>
          </Reveal>

          {/* Hero content */}
          <div className="grid gap-14 pt-20 md:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20 lg:pt-36">
            <Reveal>
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">
                  {service.category || "AA Kurmawa Services"}
                </p>

                <h1 className="mt-7 max-w-5xl font-serif text-[clamp(4rem,8vw,8.5rem)] leading-[0.82] tracking-[-0.055em]">
                  {service.title}
                </h1>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="max-w-xl lg:pb-2">
                <p className="text-sm leading-7 text-white/55 md:text-base">
                  {service.short_description || description}
                </p>

                <div className="mt-8">
                  <Link
                    href={ctaHref}
                    className="group inline-flex items-center gap-4 border-b border-white/30 pb-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:border-white"
                  >
                    {ctaLabel}

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.1}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Image */}
      {service.image_url && (
        <section className="bg-[#f2f0eb]">
          <div className="mx-auto max-w-[1600px] px-5 py-5 md:px-10 lg:px-14 lg:py-8">
            <Reveal>
              <div className="relative aspect-[16/8] overflow-hidden bg-black">
                <Image
                  src={service.image_url}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 90vw"
                  unoptimized
                  className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.015]"
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Description */}
      <section className="bg-[#f2f0eb]">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <Reveal>
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-black/35">
                  The AA Kurmawa approach
                </p>

                <p className="mt-6 max-w-xs text-[10px] uppercase leading-5 tracking-[0.2em] text-black/45">
                  Professional service.
                  <br />
                  Clear process.
                  <br />
                  Considered experience.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="max-w-4xl">
                <p className="font-serif text-3xl leading-[1.08] tracking-[-0.035em] md:text-5xl lg:text-6xl">
                  {description}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <Reveal>
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/35">
                  Ready when you are
                </p>

                <h2 className="mt-6 max-w-4xl font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.84] tracking-[-0.05em]">
                  Let&apos;s make
                  <br />
                  it simple.
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <Link
                href={ctaHref}
                className="group inline-flex min-w-[220px] items-center justify-center gap-4 bg-white px-8 py-5 text-[9px] font-semibold uppercase tracking-[0.23em] text-black transition-all duration-300 hover:bg-white/90"
              >
                {ctaLabel}

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Reveal>
          </div>

          <div className="mt-20 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-4 text-[8px] uppercase tracking-[0.24em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
              <span>AA Kurmawa Automobiles</span>
              <span>Kano · Nigeria</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}