import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";

export function AboutClosing() {
  return (
    <section
      id="closing"
      className="bg-[#f2f0eb] px-5 pb-32 pt-16 text-black md:px-10 md:pb-40 md:pt-20 lg:px-14 lg:pb-52 lg:pt-24"
    >
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <div className="grid gap-16 lg:grid-cols-[0.32fr_.68fr] lg:gap-20">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-black">
                05 — The journey continues
              </p>

              <div className="mt-7 flex items-center gap-3">
                <span className="h-px w-12 bg-black" />
                <span className="text-[12px] uppercase tracking-[0.28em] text-black">
                  AA Kurmawa Automobiles
                </span>
              </div>
            </div>

            <div>
              <h2 className="max-w-5xl font-serif text-[clamp(3.4rem,6.5vw,7.5rem)] leading-[0.88] tracking-[-0.05em]">
                Built on trust.
                <br />
                Moving forward.
              </h2>

              <p className="mt-10 max-w-2xl text-sm leading-7 text-black/55 md:text-base">
                From carefully selected vehicles to the businesses beyond
                automotive, the same principle remains at the centre of the
                journey: doing business with integrity and building for the
                long term.
              </p>

              <div className="mt-12">
                <a
                  href="/vehicles"
                  className="group inline-flex items-center gap-4 border-b border-black/25 pb-3 text-[9px] font-semibold uppercase tracking-[0.24em] transition-colors duration-300 hover:border-black"
                >
                  Explore our vehicles
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-24 border-t border-black/10 pt-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <p className="text-[14px] uppercase tracking-[0.28em] text-black/80">
                Driven by Integrity · Powered by Excellence
              </p>

              <p className="text-[14px] uppercase tracking-[0.28em] text-black/80">
                Kano · Nigeria
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}