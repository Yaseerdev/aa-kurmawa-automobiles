import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";

type AboutHeroProps = {
  heroImage?: string | null;
};

export function AboutHero({
  heroImage,
}: AboutHeroProps) {
  const safeHeroImage = heroImage?.trim() || "";
  const hasHeroImage = safeHeroImage.length > 0;

  return (
    <section
      id="about-hero"
      className="relative flex min-h-screen items-end overflow-hidden bg-black text-white"
    >
      {hasHeroImage ? (
        <>
          <Image
            src={safeHeroImage}
            alt="AA Kurmawa Automobiles"
            fill
            priority
            sizes="100vw"
            unoptimized
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06]"
          >
            <div className="absolute inset-y-0 left-[12.5%] w-px bg-white" />
            <div className="absolute inset-y-0 left-[50%] w-px bg-white" />
            <div className="absolute inset-y-0 right-[12.5%] w-px bg-white" />

            <div className="absolute inset-x-0 top-[30%] h-px bg-white" />
            <div className="absolute inset-x-0 top-[55%] h-px bg-white" />
            <div className="absolute inset-x-0 top-[80%] h-px bg-white" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-4vw] top-[10%] select-none text-[42vw] font-semibold leading-none tracking-[-0.12em] text-white/[0.025]"
          >
            AA
          </div>
        </>
      )}

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] min-w-0 px-5 pb-10 sm:pb-14 md:px-10 md:pb-16 lg:px-14 lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <div className="w-full max-w-6xl min-w-0">
              <p className="mb-6 text-[9.5px] font-medium uppercase tracking-[0.32em] text-white/60 md:text-[10px]">
                01 — About AA Kurmawa
              </p>

              <h1 className="max-w-full min-w-0 font-serif text-[clamp(3.4rem,15vw,10.5rem)] leading-[0.82] tracking-[-0.055em] text-white sm:text-[clamp(4.5rem,10vw,10.5rem)]">
                Driven by
                <br />
                something
                <br />
                greater.
              </h1>

              <p className="mt-8 max-w-xl text-sm leading-7 text-white/65 md:text-base">
                More than automobiles. A business built around integrity,
                excellence and the pursuit of a better experience.
              </p>

              <div className="mt-9">
                <Link
                  href="#story"
                  className="group inline-flex items-center gap-4 border-b border-white/30 pb-3 text-[10.5px] font-semibold uppercase tracking-[0.27em] text-white transition-colors duration-300 hover:border-white"
                >
                  Discover our story

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.1}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="hidden lg:block lg:pb-1">
              <div className="flex items-center gap-4 [writing-mode:vertical-rl]">
                <span className="text-[9.5px] uppercase tracking-[0.33em] text-white/45">
                  Kano · Nigeria
                </span>

                <span className="h-16 w-px bg-white/20" />

                <span className="text-[9.5px] uppercase tracking-[0.33em] text-white/45">
                  Our story
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5 md:mt-20">
          <div className="flex items-center gap-5">
            <span className="text-[9.5px] uppercase tracking-[0.3em] text-white/45">
              AA Kurmawa Automobiles
            </span>

            <span className="hidden h-3 w-px bg-white/20 sm:block" />

            <span className="hidden text-[9.5px] uppercase tracking-[0.3em] text-white/45 sm:block">
              Driven by Integrity, Powered by Excellence
            </span>
          </div>

          <a
            href="#story"
            aria-label="Scroll to our story"
            className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.24em] text-white/50 transition-colors hover:text-white"
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