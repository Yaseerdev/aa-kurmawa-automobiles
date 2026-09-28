import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";

const constructionImage =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=90";

const agricultureImage =
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=90";

export function HomeBeyondAutomotive() {
  return (
    <section
      id="beyond-automotive"
      className="relative overflow-hidden bg-[#111213] text-white"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:py-28 md:px-10 md:py-36 lg:px-14 lg:py-44">
        {/* Header */}
        <Reveal>
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/45">
              05 — Beyond Automotive
            </p>

            <p className="hidden text-[8px] uppercase tracking-[0.25em] text-white/25 sm:block">
              A broader enterprise
            </p>
          </div>
        </Reveal>

        {/* Intro */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:gap-20">
          <Reveal>
            <div>
              <p className="text-[9px] uppercase tracking-[0.28em] text-white/35">
                More than automobiles
              </p>

              <h2 className="mt-7 max-w-5xl font-serif text-[clamp(3.8rem,8vw,8.5rem)] leading-[0.84] tracking-[-0.055em]">
                Built beyond
                <br />
                the showroom.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="max-w-md text-sm leading-7 text-white/50 md:text-base">
              AA Kurmawa has grown beyond automotive solutions into other
              areas of business, including construction and real estate,
              general supply and agriculture.
            </p>
          </Reveal>
        </div>

        {/* Business sectors */}
        <div className="mt-20 grid gap-px bg-white/10 md:grid-cols-2">
          {/* Construction */}
          <Reveal>
            <Link
              href="/about"
              className="group relative block overflow-hidden bg-[#171819]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={constructionImage}
                  alt="Construction and real estate"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                />

                <div className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/25" />

                <div className="absolute inset-x-0 bottom-0 p-7 md:p-9 lg:p-10">
                  <div className="flex items-end justify-between gap-8">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.28em] text-white/55">
                        01
                      </p>

                      <h3 className="mt-3 max-w-md font-serif text-3xl leading-none tracking-[-0.03em] text-white md:text-4xl lg:text-5xl">
                        Construction
                        <br />
                        & Real Estate
                      </h3>
                    </div>

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/30 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.1}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 px-7 py-5 md:px-9 lg:px-10">
                <p className="text-[8px] uppercase tracking-[0.23em] text-white/30">
                  Explore the group
                </p>

                <span className="text-[8px] uppercase tracking-[0.23em] text-white/20">
                  AA Kurmawa
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Supply & Agriculture */}
          <Reveal delay={0.1}>
            <Link
              href="/about"
              className="group block bg-[#171819]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={agricultureImage}
                  alt="General supply and agriculture"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                />

                <div className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/25" />

                <div className="absolute inset-x-0 bottom-0 p-7 md:p-9 lg:p-10">
                  <div className="flex items-end justify-between gap-8">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.28em] text-white/55">
                        02
                      </p>

                      <h3 className="mt-3 max-w-md font-serif text-3xl leading-none tracking-[-0.03em] text-white md:text-4xl lg:text-5xl">
                        General Supply
                        <br />
                        & Agriculture
                      </h3>
                    </div>

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/30 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.1}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 px-7 py-5 md:px-9 lg:px-10">
                <p className="text-[8px] uppercase tracking-[0.23em] text-white/30">
                  Explore the group
                </p>

                <span className="text-[8px] uppercase tracking-[0.23em] text-white/20">
                  AA Kurmawa
                </span>
              </div>
            </Link>
          </Reveal>
        </div>

        {/* Closing statement */}
        <Reveal delay={0.15}>
          <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[9px] uppercase leading-5 tracking-[0.22em] text-white/30">
              One enterprise.
              <br />
              Multiple areas of business.
            </p>

            <Link
              href="/about"
              className="group inline-flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-white"
            >
              Discover the group

              <span className="flex h-8 w-8 items-center justify-center border border-white/20 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}