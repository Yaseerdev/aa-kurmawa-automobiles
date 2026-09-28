import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";

export function AboutChairman() {
  return (
    <section className="bg-[#f2f0eb] text-black">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <Reveal>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-black/35">
                04 — Leadership
              </p>

              <div className="mt-7 flex items-center gap-4">
                <span className="h-px w-8 bg-black/15" />
                <span className="text-[8px] uppercase tracking-[0.28em] text-black/35">
                  The Chairman
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <h2 className="max-w-5xl font-serif text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.84] tracking-[-0.055em]">
                Leadership with
                <br />
                purpose.
              </h2>
            </div>
          </Reveal>
        </div>

        {/* Chairman profile */}
        <div className="mt-20 border-t border-black/10 pt-5 md:mt-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            {/* Portrait */}
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <Image
                  src="/chairman-auwal-ahmad.jpg"
                  alt="Chairman of AA Kurmawa Automobiles"
                  fill
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover object-center transition-transform duration-[1400ms] ease-out hover:scale-[1.015]"
                />

                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/45 to-transparent p-6 md:p-8">
                  <p className="text-[8px] uppercase tracking-[0.28em] text-white/60">
                    AA Kurmawa Automobiles
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Information */}
            <Reveal delay={0.1}>
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-black/35">
                    Chairman
                  </p>

                  <h3 className="mt-6 font-serif text-4xl leading-[0.95] tracking-[-0.04em] md:text-6xl">
                    Auwal Ahmad
                  </h3>

                  <div className="mt-10 max-w-xl border-t border-black/10 pt-8">
                    <p className="text-sm leading-7 text-black/60 md:text-base">
                      AA Kurmawa Automobiles is built around a clear belief:
                      integrity should come first, excellence should remain the
                      standard, and every customer relationship should matter.
                    </p>
                  </div>
                </div>

                <div className="mt-16">
                  <div className="grid grid-cols-2 border-y border-black/10">
                    <div className="border-r border-black/10 py-6 pr-5">
                      <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                        Position
                      </p>

                      <p className="mt-3 text-sm text-black">
                        Chairman
                      </p>
                    </div>

                    <div className="py-6 pl-5">
                      <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                        Company
                      </p>

                      <p className="mt-3 text-sm text-black">
                        AA Kurmawa Automobiles
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/about/chairman"
                    className="group mt-8 inline-flex items-center gap-4 border-b border-black/20 pb-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-black transition-colors hover:border-black"
                  >
                    Meet the chairman

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
      </div>
    </section>
  );
}