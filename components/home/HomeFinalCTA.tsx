import { ArrowUpRight, Phone } from "lucide-react";

import { Reveal } from "@/components/Reveal";

type HomeFinalCTAProps = {
  phone: string;
};

export function HomeFinalCTA({ phone }: HomeFinalCTAProps) {
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <section
      id="final-cta"
      className="relative overflow-hidden bg-black text-white"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-8 md:px-10 md:py-36 lg:px-14 lg:py-44">
        {/* Section label */}
        <Reveal>
          <div className="border-t border-white/15 pt-5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/45">
                09 — Your next move
              </p>

              <p className="hidden text-[9px] uppercase tracking-[0.28em] text-white/30 sm:block">
                AA Kurmawa Automobiles
              </p>
            </div>
          </div>
        </Reveal>

        {/* Main statement */}
        <div className="mt-24 grid gap-16 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-20">
          <Reveal>
            <div>
              <p className="mb-8 text-[9px] font-medium uppercase tracking-[0.3em] text-white/40">
                Start your journey
              </p>

              <h2 className="max-w-6xl font-serif text-[clamp(4.5rem,9vw,10rem)] leading-[0.8] tracking-[-0.06em]">
                Your next
                <br />
                vehicle
                <br />
                awaits.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="max-w-md lg:pb-2">
              <p className="text-sm leading-7 text-white/55 md:text-base">
                Whether you already know what you want or are still exploring,
                our team is here to help you find the right vehicle and make
                the process simple.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a
                  href="#appointment"
                  className="group inline-flex items-center justify-center gap-4 bg-white px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-black transition-all duration-300 hover:bg-white/90"
                >
                  Book an appointment

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>

                <a
                  href={phoneHref}
                  className="group inline-flex items-center justify-center gap-4 border border-white/20 px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-white/50"
                >
                  <Phone
                    size={13}
                    strokeWidth={1.2}
                  />

                  Call AA Kurmawa
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom information */}
        <Reveal delay={0.18}>
          <div className="mt-24 border-t border-white/15 pt-6 md:mt-32">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[0.28em] text-white/30">
                  Ready when you are.
                </p>

                <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-white/30">
                  AA Kurmawa · Kano, Nigeria
                </p>
              </div>

              <a
                href="#hero"
                className="group inline-flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.22em]"
              >
                Back to top

                <span className="flex h-8 w-8 items-center justify-center border border-white/20 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.2}
                    className="rotate-[-45deg] transition-transform duration-300 group-hover:-translate-y-0.5"
                  />
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}