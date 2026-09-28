import { ArrowUpRight, Check } from "lucide-react";

import { Reveal } from "@/components/Reveal";

const principles = [
  {
    number: "01",
    title: "Integrity",
    description:
      "Every relationship begins with honesty, clarity and a commitment to doing business the right way.",
  },
  {
    number: "02",
    title: "Selection",
    description:
      "A considered collection of new and pre-owned vehicles presented with clarity and attention to detail.",
  },
  {
    number: "03",
    title: "Service",
    description:
      "From professional servicing to documentation and leasing, our approach extends beyond the vehicle itself.",
  },
  {
    number: "04",
    title: "Excellence",
    description:
      "A premium experience built around professionalism, personal attention and long-term relationships.",
  },
];

export function HomeStandard() {
  return (
    <section
      id="standard"
      className="relative overflow-hidden bg-[#08090a] text-white"
    >
      {/* Subtle editorial grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-5 py-28 sm:py-32 md:px-10 md:py-40 lg:px-14 lg:py-48">
        {/* Header */}
        <Reveal>
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/45">
              03 — The AA Kurmawa Standard
            </p>

            <p className="hidden text-[8px] uppercase tracking-[0.25em] text-white/25 sm:block">
              Driven by Integrity · Powered by Excellence
            </p>
          </div>
        </Reveal>

        {/* Main statement */}
        <div className="mt-20 grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <Reveal>
            <div>
              <p className="mb-7 text-[9px] uppercase tracking-[0.28em] text-white/35">
                More than a vehicle.
              </p>

              <h2 className="max-w-5xl font-serif text-[clamp(4rem,9vw,9.5rem)] leading-[0.82] tracking-[-0.055em] text-white">
                A standard.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex h-full items-end">
              <div className="max-w-md lg:pb-2">
                <p className="text-sm leading-7 text-white/55 md:text-base">
                  At AA Kurmawa Automobiles, the vehicle is only part of the
                  experience. We believe in doing business with integrity,
                  presenting quality vehicles clearly and serving every client
                  with professionalism.
                </p>

                <a
                  href="/about"
                  className="group mt-8 inline-flex items-center gap-4 border-b border-white/20 pb-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:border-white"
                >
                  Discover AA Kurmawa

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Principles */}
        <div className="mt-28 border-t border-white/10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle, index) => (
              <Reveal
                key={principle.number}
                delay={index * 0.06}
              >
                <div className="group border-b border-white/10 py-9 md:min-h-[270px] md:border-r md:px-7 md:first:pl-0 lg:border-b-0 lg:py-12 lg:first:pl-0 lg:last:border-r-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] uppercase tracking-[0.25em] text-white/30">
                      {principle.number}
                    </span>

                    <Check
                      size={14}
                      strokeWidth={1}
                      className="text-white/25 transition-colors duration-300 group-hover:text-white"
                    />
                  </div>

                  <h3 className="mt-16 font-serif text-3xl tracking-[-0.03em] text-white md:text-4xl">
                    {principle.title}
                  </h3>

                  <p className="mt-5 max-w-xs text-xs leading-6 text-white/40 transition-colors duration-300 group-hover:text-white/55">
                    {principle.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Closing line */}
        <Reveal delay={0.15}>
          <div className="mt-24 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-[9px] uppercase leading-5 tracking-[0.22em] text-white/30">
              A relationship built beyond the showroom.
            </p>

            <div className="flex items-center gap-3 text-[8px] uppercase tracking-[0.25em] text-white/25">
              <span className="h-px w-8 bg-white/20" />
              Kano · Nigeria
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}