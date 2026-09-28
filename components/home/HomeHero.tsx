import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";

type HomeHeroProps = {
  businessName: string;
  eyebrow: string;
  title: string;
  description: string;
  heroImage?: string | null;
};

export function HomeHero({
  businessName,
  eyebrow,
  title,
  description,
  heroImage,
}: HomeHeroProps) {
  // Safely handle null, undefined, and empty strings.
  const safeHeroImage = heroImage?.trim() || "";
  const hasHeroImage = safeHeroImage.length > 0;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-end overflow-hidden bg-[#050505] text-white"
    >
      {/* =========================================================
          HERO IMAGE
          Only rendered when an image actually exists.
      ========================================================= */}
      {hasHeroImage && (
        <>
          <Image
            src={safeHeroImage}
            alt={`${businessName} premium automobile`}
            fill
            priority
            sizes="100vw"
            unoptimized
            className="object-cover object-center"
          />

          {/* Cinematic image overlays */}
          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-black/10" />

          <div className="absolute inset-0 bg-linear-to-r from-black/35 via-transparent to-transparent" />
        </>
      )}

      {/* =========================================================
          PREMIUM IMAGE-FREE HERO
          Appears only when no hero image is configured.
      ========================================================= */}
      {!hasHeroImage && (
        <>
          {/* Architectural grid */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.075]"
          >
            <div className="absolute inset-y-0 left-[12.5%] w-px bg-white" />
            <div className="absolute inset-y-0 left-[50%] w-px bg-white" />
            <div className="absolute inset-y-0 right-[12.5%] w-px bg-white" />

            <div className="absolute inset-x-0 top-[28%] h-px bg-white" />
            <div className="absolute inset-x-0 top-[53%] h-px bg-white" />
            <div className="absolute inset-x-0 top-[78%] h-px bg-white" />
          </div>

          {/* Giant AA watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-3vw] top-[15%] select-none font-sans text-[42vw] font-semibold leading-none tracking-[-0.12em] text-white/[0.025]"
          >
            AA
          </div>

          {/* Editorial frame */}
          <div
            aria-hidden="true"
            className="absolute right-[12.5%] top-[28%] hidden h-[47%] w-[20%] border border-white/[0.12] lg:block"
          >
            <div className="absolute inset-4 border border-white/[0.07]" />

            <div className="absolute right-4 top-4 text-[7px] uppercase tracking-[0.3em] text-white/30">
              01 — 01
            </div>

            <div className="absolute bottom-7 left-6">
              <div className="mb-4 h-px w-10 bg-white/20" />

              <p className="text-[7px] uppercase tracking-[0.3em] text-white/30">
                Photography
              </p>

              <p className="mt-2 max-w-[150px] font-serif text-2xl leading-[0.9] tracking-[-0.035em] text-white/85">
                The collection
                <br />
                awaits.
              </p>
            </div>

            <div className="absolute bottom-7 right-6 text-[7px] uppercase tracking-[0.25em] text-white/20 [writing-mode:vertical-rl]">
              Automotive
            </div>
          </div>

          {/* Small editorial marker */}
          <div className="absolute right-[13.5%] top-[23%] hidden items-center gap-3 lg:flex">
            <span className="h-px w-12 bg-white/20" />

            <span className="text-[7px] uppercase tracking-[0.3em] text-white/30">
              Automotive
            </span>
          </div>
        </>
      )}

      {/* =========================================================
          NAVIGATION
      ========================================================= */}
      <Navbar />

      {/* =========================================================
          HERO CONTENT
      ========================================================= */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 sm:pb-14 md:px-10 md:pb-16 lg:px-14 lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <div className="max-w-6xl">
              <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.32em] text-white/65 md:text-[10px]">
                {eyebrow}
              </p>

              <h1 className="max-w-5xl font-serif text-[clamp(4.5rem,10vw,10.5rem)] leading-[0.78] tracking-[-0.055em] text-white">
                {title}
              </h1>

              <p className="mt-8 max-w-xl text-sm leading-7 text-white/65 md:text-base">
                {description}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#collection"
                  className="group inline-flex items-center justify-center gap-4 bg-white px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-black transition-all duration-300 hover:bg-white/90"
                >
                  Explore collection

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>

                <a
                  href="#appointment"
                  className="group inline-flex items-center justify-center gap-4 border border-white/30 px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  Book an appointment

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </Reveal>

          {/* =======================================================
              HERO SIDE META
          ======================================================= */}
          <Reveal delay={0.15}>
            <div className="hidden lg:block lg:pb-1">
              <div className="flex items-center gap-4 [writing-mode:vertical-rl]">
                <span className="text-[8px] uppercase tracking-[0.3em] text-white/45">
                  Kano · Nigeria
                </span>

                <span className="h-16 w-px bg-white/20" />

                <span className="text-[8px] uppercase tracking-[0.3em] text-white/35">
                  Automotive
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* =========================================================
            BOTTOM INFORMATION BAR
        ========================================================= */}
        <div className="mt-16 flex items-center justify-between border-t border-white/20 pt-5 md:mt-20">
          <div className="flex items-center gap-5">
            <span className="text-[8px] uppercase tracking-[0.26em] text-white/45">
              AA Kurmawa Automobiles
            </span>

            <span className="hidden h-3 w-px bg-white/20 sm:block" />

            <span className="hidden text-[8px] uppercase tracking-[0.26em] text-white/35 sm:block">
              New & pre-owned vehicles
            </span>
          </div>

          <a
            href="#collection"
            aria-label="Scroll to collection"
            className="group flex items-center gap-3 text-[8px] uppercase tracking-[0.24em] text-white/50 transition-colors hover:text-white"
          >
            Scroll

            <span className="flex h-8 w-8 items-center justify-center border border-white/20 transition-all duration-300 group-hover:border-white/50">
              <ArrowDown
                size={13}
                strokeWidth={1.1}
                className="animate-bounce"
              />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}