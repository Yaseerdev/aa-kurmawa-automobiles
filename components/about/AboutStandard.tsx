import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";

const standards = [
  {
    number: "01",
    title: "Integrity",
    description:
      "We believe trust is built through clear communication, honest dealings and doing what we say.",
  },
  {
    number: "02",
    title: "Excellence",
    description:
      "From the vehicles we present to the way we serve our customers, we pursue a consistently high standard.",
  },
  {
    number: "03",
    title: "Professionalism",
    description:
      "Every interaction is approached with care, respect and attention to detail.",
  },
  {
    number: "04",
    title: "Long-term trust",
    description:
      "Our goal is not simply to complete a transaction, but to build relationships that last beyond it.",
  },
];

export function AboutStandard() {
  return (
    <section
      id="standard"
      className="overflow-hidden bg-black text-white"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:py-28 md:px-10 md:py-36 lg:px-14 lg:py-44">
        {/* Header */}
        <div className="grid gap-14 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
          <Reveal>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/60">
                03 — The AA Kurmawa Standard
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-10 bg-white/20" />

                <span className="text-[9px] uppercase tracking-[0.25em] text-white/55">
                  Our principles
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-6xl">
              <h2 className="font-serif text-5xl leading-[0.9] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[7.4rem]">
                More than
                <br />
                a vehicle.
                <br />
                <span className="text-white/40">A standard.</span>
              </h2>
            </div>
          </Reveal>
        </div>

        {/* Statement */}
        <Reveal delay={0.12}>
          <div className="mt-24 border-y border-white/10 py-10 md:mt-32 md:py-14 lg:mt-40">
            <div className="grid gap-10 md:grid-cols-[0.55fr_1.45fr] md:gap-24">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                What drives us
              </p>

              <p className="max-w-5xl font-serif text-2xl leading-[1.1] tracking-[-0.03em] text-white/90 sm:text-3xl md:text-4xl lg:text-5xl">
                Driven by integrity, powered by excellence — our standard
                shapes how we present our vehicles, serve our customers and
                build for the future.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Principles */}
        <div className="mt-20 md:mt-28 lg:mt-36">
          <div className="border-t border-white/10">
            {standards.map((standard, index) => (
              <Reveal
                key={standard.number}
                delay={index * 0.06}
              >
                <article className="group border-b border-white/10 transition-colors duration-500 hover:bg-white/[0.025]">
                  <div className="grid gap-8 py-10 md:grid-cols-[90px_1fr_auto] md:items-center md:gap-10 md:py-14 lg:py-16">
                    {/* Number */}
                    <div>
                      <span className="text-[8px] uppercase tracking-[0.28em] text-white/25">
                        {standard.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-14">
                      <h3 className="font-serif text-4xl leading-none tracking-[-0.035em] transition-transform duration-500 group-hover:translate-x-1 sm:text-5xl lg:text-6xl">
                        {standard.title}
                      </h3>

                      <p className="max-w-xl text-sm leading-7 text-white/45 md:text-base md:leading-8">
                        {standard.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:block">
                      <span className="flex h-11 w-11 items-center justify-center border border-white/15 text-white/40 transition-all duration-500 group-hover:border-white/50 group-hover:bg-white group-hover:text-black">
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.2}
                          className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Closing statement */}
        <Reveal delay={0.1}>
          <div className="mt-24 border-b border-white/10 pb-8 md:mt-32">
            <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[9.5px] uppercase tracking-[0.3em] text-white/40">
                  The principle behind the business
                </p>

                <p className="mt-6 max-w-4xl font-serif text-3xl leading-[1.04] tracking-[-0.04em] sm:text-4xl md:text-5xl lg:text-6xl">
                  The experience matters as much as the transaction.
                </p>
              </div>

              <a
                href="#chairman"
                className="group inline-flex w-fit items-center gap-4 border-b border-white/20 pb-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-white transition-colors hover:border-white"
              >
                Meet the chairman

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}