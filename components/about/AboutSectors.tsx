import {
  ArrowUpRight,
  Building2,
  Wheat,
} from "lucide-react";

import { Reveal } from "@/components/Reveal";

const sectors = [
  {
    number: "01",
    icon: Building2,
    title: "Construction & Real Estate",
    description:
      "Extending our commitment to excellence into civil, structural and property development projects.",
    label: "Built to last.",
  },
  {
    number: "02",
    icon: Wheat,
    title: "General Supply & Agriculture",
    description:
      "Supporting businesses and communities through procurement, food production and processing.",
    label: "Built for growth.",
  },
];

export function AboutSectors() {
  return (
    <section
      id="sectors"
      className="bg-black px-5 py-28 text-white md:px-10 md:py-36 lg:px-14 lg:py-44"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-16 lg:grid-cols-[0.32fr_0.68fr] lg:gap-20">
          <Reveal>
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/40">
                05 — Beyond automotive
              </p>

              <div className="mt-7 flex items-center gap-3">
                <span className="h-px w-8 bg-white/20" />
                <span className="text-[8px] uppercase tracking-[0.28em] text-white/30">
                  A growing enterprise
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <h2 className="max-w-5xl font-serif text-[clamp(3rem,6vw,7rem)] leading-[0.88] tracking-[-0.045em]">
                More than
                <br />
                automobiles.
              </h2>

              <p className="mt-10 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
                What began around the automobile business has grown into a
                broader enterprise, with interests extending into other areas
                of business while remaining grounded in the same principles.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 border-t border-white/10">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;

            return (
              <Reveal key={sector.number} delay={index * 0.08}>
                <article className="group grid border-b border-white/10 py-12 md:grid-cols-[100px_1fr_auto] md:items-center md:gap-10 md:py-16">
                  <div className="flex items-center justify-between md:block">
                    <span className="text-[8px] uppercase tracking-[0.28em] text-white/30">
                      {sector.number}
                    </span>

                    <Icon
                      size={18}
                      strokeWidth={1}
                      className="text-white/35 md:mt-10"
                    />
                  </div>

                  <div className="mt-8 md:mt-0">
                    <p className="mb-4 text-[8px] font-medium uppercase tracking-[0.28em] text-white/35">
                      {sector.label}
                    </p>

                    <h3 className="font-serif text-3xl tracking-[-0.025em] md:text-5xl lg:text-6xl">
                      {sector.title}
                    </h3>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50">
                      {sector.description}
                    </p>
                  </div>

                  <div className="mt-8 md:mt-0">
                    <span className="flex h-11 w-11 items-center justify-center border border-white/15 transition-all duration-500 group-hover:border-white/50 group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.2}
                        className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-20 flex flex-col justify-between gap-8 border-t border-white/10 pt-8 md:flex-row md:items-end">
            <p className="max-w-xl text-[9px] uppercase leading-5 tracking-[0.24em] text-white/35">
              From automobiles to a growing business group.
              <br />
              The journey continues.
            </p>

            <a
              href="/"
              className="group inline-flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-white"
            >
              Explore AA Kurmawa
              <ArrowUpRight
                size={14}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}