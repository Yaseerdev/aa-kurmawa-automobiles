import { ArrowUpRight, Check } from "lucide-react";

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
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/40">
                03 — The AA Kurmawa Standard
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-10 bg-white/20" />

                <span className="text-[8px] uppercase tracking-[0.25em] text-white/30">
                  Our principles
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-6xl">
              <h2 className="font-serif text-5xl leading-[0.92] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[7.2rem]">
                More than
                <br />
                a vehicle.
                <br />
                <span className="text-white/45">A standard.</span>
              </h2>
            </div>
          </Reveal>
        </div>

        {/* Statement */}
        <div className="mt-24 border-y border-white/10 py-10 md:mt-32 md:py-14 lg:mt-40">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-[0.55fr_1.45fr] md:gap-24">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                What drives us
              </p>

              <p className="max-w-5xl font-serif text-2xl leading-[1.12] tracking-[-0.025em] text-white/90 sm:text-3xl md:text-4xl lg:text-5xl">
                Driven by integrity, powered by excellence — our standard
                shapes how we present our vehicles, serve our customers and
                build for the future.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Principles */}
        <div className="mt-20 md:mt-28 lg:mt-36">
          <div className="grid border-t border-white/10 md:grid-cols-2">
            {standards.map((standard, index) => (
              <Reveal key={standard.number} delay={index * 0.06}>
                <div
                  className={[
                    "group border-b border-white/10 py-10 md:py-14",
                    index % 2 === 0
                      ? "md:border-r md:pr-12 lg:pr-16"
                      : "md:pl-12 lg:pl-16",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-8">
                    <span className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                      {standard.number}
                    </span>

                    <Check
                      size={15}
                      strokeWidth={1}
                      className="text-white/25 transition-transform duration-500 group-hover:rotate-45 group-hover:text-white/60"
                    />
                  </div>

                  <h3 className="mt-12 font-serif text-4xl tracking-[-0.035em] sm:text-5xl">
                    {standard.title}
                  </h3>

                  <p className="mt-6 max-w-md text-sm leading-7 text-white/45 md:text-base md:leading-8">
                    {standard.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Closing */}
        <Reveal delay={0.1}>
          <div className="mt-24 flex flex-col gap-10 border-b border-white/10 pb-8 md:mt-32 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                The principle behind the business
              </p>

              <p className="mt-6 max-w-3xl font-serif text-3xl leading-[1.05] tracking-[-0.035em] sm:text-4xl md:text-5xl">
                The experience matters as much as the transaction.
              </p>
            </div>

            <a
              href="#chairman"
              className="group inline-flex w-fit items-center gap-4 border-b border-white/20 pb-3 text-[9px] font-semibold uppercase tracking-[0.23em] text-white transition-colors hover:border-white"
            >
              Meet the chairman

              <ArrowUpRight
                size={13}
                strokeWidth={1.1}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}