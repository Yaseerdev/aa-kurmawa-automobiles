import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";

export function AboutStory() {
  return (
    <section
      id="story"
      className="bg-[#f2f0eb] text-black"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:py-28 md:px-10 md:py-36 lg:px-14 lg:py-44">
        {/* Intro */}
        <div className="grid gap-14 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
          <Reveal>
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-black/40">
                02 — Our Story
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-10 bg-black/20" />

                <span className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  AA Kurmawa
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-5xl">
              <p className="font-serif text-4xl leading-[1.04] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-[5.4rem]">
                Built on integrity.
                <br />
                Driven by excellence.
                <br />
                Growing with purpose.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Story */}
        <div className="mt-24 grid gap-14 border-t border-black/10 pt-8 md:mt-32 md:grid-cols-[0.55fr_1.45fr] md:gap-24 lg:mt-40">
          <Reveal>
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-black/40">
                Where it began
              </p>

              <p className="mt-6 max-w-xs text-[10px] uppercase leading-5 tracking-[0.2em] text-black/45">
                A business shaped by trust,
                <br />
                relationships and
                <br />
                long-term thinking.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-4xl space-y-8">
              <p className="text-base leading-8 text-black/65 md:text-lg md:leading-9">
                AA Kurmawa Automobiles began with a clear ambition: to build a
                business where integrity comes first and every customer
                interaction matters.
              </p>

              <p className="text-base leading-8 text-black/65 md:text-lg md:leading-9">
                What began around the automobile business has grown into a
                broader enterprise serving customers through automotive
                solutions while extending into other areas of business.
              </p>

              <p className="text-base leading-8 text-black/65 md:text-lg md:leading-9">
                Today, the company continues to build on that foundation —
                combining professional service, carefully selected vehicles
                and a commitment to doing business the right way.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Closing statement */}
        <div className="mt-24 md:mt-32 lg:mt-40">
          <Reveal>
            <div className="relative border-y border-black/10 py-12 md:py-16">
              <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
                <p className="max-w-4xl font-serif text-3xl leading-[1.08] tracking-[-0.035em] md:text-5xl lg:text-6xl">
                  We believe a business should be measured not only by what it
                  sells, but by the trust it earns.
                </p>

                <span className="hidden text-[8px] uppercase tracking-[0.25em] text-black/30 md:block">
                  Integrity first
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Continue */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[10px] uppercase leading-5 tracking-[0.18em] text-black/40">
              From automobiles to a growing business group, the journey
              continues.
            </p>

            <Link
              href="#standard"
              className="group inline-flex w-fit items-center gap-4 border-b border-black/20 pb-3 text-[9px] font-semibold uppercase tracking-[0.23em] transition-colors hover:border-black"
            >
              Continue the story

              <ArrowDown
                size={13}
                strokeWidth={1.1}
                className="transition-transform duration-300 group-hover:translate-y-1"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}