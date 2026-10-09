import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

import { Reveal } from "@/components/Reveal";

type AboutStoryProps = {
  storyImage?: string | null;
};

export function AboutStory({
  storyImage,
}: AboutStoryProps) {
  const image = storyImage?.trim() || "";

  return (
    <section
      id="story"
      className="w-full max-w-full overflow-x-clip bg-[#f2f0eb] text-black"
    >
      <div className="mx-auto w-full max-w-[1600px] overflow-x-clip px-5 py-24 sm:py-28 md:px-10 md:py-36 lg:px-14 lg:py-44">
        {/* INTRO */}
        <div className="grid min-w-0 gap-14 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
          <Reveal>
            <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/60">
                02 — Our Story
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-10 shrink-0 bg-black/20" />

                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.25em] text-black/55">
                  AA Kurmawa
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="min-w-0 max-w-5xl">
              <p className="font-serif text-4xl leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-[5.4rem]">
                Built on integrity.
                <br />
                Driven by excellence.
                <br />
                Growing with purpose.
              </p>
            </div>
          </Reveal>
        </div>

        {/* STORY IMAGE */}
        <Reveal delay={0.12}>
          <div className="mt-20 w-full max-w-full min-w-0 md:mt-28 lg:mt-36">
            <div className="relative w-full max-w-full overflow-hidden bg-[#d8d4cc] aspect-[4/3] sm:aspect-[16/8] md:aspect-[21/9] md:min-h-[420px]">
              {image ? (
                <>
                  <Image
                    src={image}
                    alt="AA Kurmawa Automobiles"
                    fill
                    sizes="100vw"
                    unoptimized
                    className="object-cover object-center transition-transform duration-[1400ms] ease-out hover:scale-[1.015]"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-black/5" />

                  <div className="absolute bottom-5 left-5 max-w-[85%] md:bottom-8 md:left-8">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/75">
                      The journey
                    </p>

                    <p className="mt-2 font-serif text-2xl tracking-[-0.03em] text-white md:text-4xl">
                      From vision to enterprise.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.08]"
                  >
                    <div className="absolute inset-y-0 left-[16.66%] w-px bg-black" />
                    <div className="absolute inset-y-0 left-[50%] w-px bg-black" />
                    <div className="absolute inset-y-0 right-[16.66%] w-px bg-black" />

                    <div className="absolute inset-x-0 top-1/2 h-px bg-black" />
                  </div>

                  <div
                    aria-hidden="true"
                    className="absolute right-[-3vw] top-[-7vw] select-none font-sans text-[28vw] font-semibold leading-none tracking-[-0.12em] text-black/[0.035]"
                  >
                    AA
                  </div>

                  <div className="absolute inset-0 flex items-end justify-between gap-6 p-6 md:p-8">
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.3em] text-black/35">
                        Editorial image
                      </p>

                      <p className="mt-2 font-serif text-2xl tracking-[-0.03em] text-black/80 md:text-4xl">
                        The journey continues.
                      </p>
                    </div>

                    <span className="shrink-0 text-[8px] uppercase tracking-[0.25em] text-black/25">
                      02 — 01
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Reveal>

        {/* STORY COPY */}
        <div className="mt-20 grid min-w-0 gap-14 border-t border-black/10 pt-8 md:mt-28 md:grid-cols-[0.55fr_1.45fr] md:gap-24 lg:mt-32">
          <Reveal>
            <div className="min-w-0">
              <p className="text-[9.5px] font-medium uppercase tracking-[0.35em] text-black/80">
                Where it began
              </p>

              <p className="mt-6 max-w-xs text-[10.5px] uppercase leading-5 tracking-[0.25em] text-black/60">
                A business shaped by trust,
                <br />
                relationships and
                <br />
                long-term thinking.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="min-w-0 max-w-4xl">
              <p className="text-base leading-8 text-black/65 md:text-lg md:leading-9">
                AA Kurmawa Automobiles began with a clear ambition: to build a
                business where integrity comes first and every customer
                interaction matters.
              </p>

              <p className="mt-8 text-base leading-8 text-black/65 md:text-lg md:leading-9">
                What began around the automobile business has grown into a
                broader enterprise serving customers through automotive
                solutions while extending into other areas of business.
              </p>

              <p className="mt-8 text-base leading-8 text-black/65 md:text-lg md:leading-9">
                Today, the company continues to build on that foundation —
                combining professional service, carefully selected vehicles
                and a commitment to doing business the right way.
              </p>
            </div>
          </Reveal>
        </div>

        {/* BELIEF */}
        <Reveal delay={0.12}>
          <div className="mt-24 w-full max-w-full overflow-hidden border-y border-black/10 md:mt-32 lg:mt-40">
            <div className="grid min-w-0 gap-10 py-12 md:grid-cols-[0.55fr_1.45fr] md:gap-24 md:py-16">
              <div>
                <p className="text-[9.5px] uppercase tracking-[0.3em] text-black/80">
                  Our belief
                </p>
              </div>

              <div className="flex min-w-0 items-end justify-between gap-10">
                <p className="min-w-0 max-w-4xl font-serif text-3xl leading-[1.08] tracking-[-0.04em] sm:text-4xl md:text-5xl lg:text-6xl">
                  We believe a business should be measured not only by what it
                  sells, but by the trust it earns.
                </p>

                <span className="hidden shrink-0 pb-1 text-[12px] uppercase tracking-[0.28em] text-black/50 md:block">
                  Integrity first
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CONTINUE */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[12px] uppercase leading-5 tracking-[0.18em] text-black/50">
              From automobiles to a growing business group, the journey
              continues.
            </p>

            <Link
              href="#standard"
              className="group inline-flex w-fit shrink-0 items-center gap-4 border-b border-black/20 pb-3 text-[9px] font-semibold uppercase tracking-[0.23em] transition-colors hover:border-black"
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