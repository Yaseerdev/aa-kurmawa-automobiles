import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";

type AboutChairmanProps = {
  name?: string | null;
  image?: string | null;
  bio?: string | null;
};

export function AboutChairman({
  name,
  image,
  bio,
}: AboutChairmanProps) {
  const chairmanName = name?.trim() || "Auwal Ahmad";
  const chairmanImage = image?.trim() || "";
  const chairmanBio =
    bio?.trim() ||
    "A leader behind the vision and continued growth of AA Kurmawa Automobiles.";

  return (
    <section
      id="chairman"
      className="bg-[#f2f0eb] text-black"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">
        {/* Header */}
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
          <Reveal>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-black/70">
                04 — Leadership
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-10 bg-black/20" />

                <span className="text-[10px] uppercase tracking-[0.25em] text-black/50">
                  The Chairman
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-6xl">
              <h2 className="font-serif text-5xl leading-[0.88] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[7rem]">
                Leadership with
                <br />
                purpose.
              </h2>
            </div>
          </Reveal>
        </div>

        {/* Profile */}
        <div className="mt-20 border-t border-black/10 pt-6 md:mt-28 md:pt-8">
          <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-24">
            {/* Portrait */}
            <Reveal>
              <div className="group relative overflow-hidden bg-[#0a0a0a]">
                <div className="relative aspect-[4/5]">
                  {chairmanImage ? (
                    <Image
                      src={chairmanImage}
                      alt={`${chairmanName} — Chairman of AA Kurmawa Automobiles`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 62vw"
                      unoptimized
                      className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.015]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-8 text-center">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-white/30">
                          Chairman Portrait
                        </p>

                        <div className="mx-auto mt-6 h-px w-10 bg-white/15" />

                        <p className="mt-6 font-serif text-3xl tracking-[-0.03em] text-white/85 md:text-4xl">
                          Picture coming soon.
                        </p>

                        <p className="mx-auto mt-4 max-w-xs text-[9px] uppercase leading-5 tracking-[0.2em] text-white/30">
                          Add the official portrait from Site Settings.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image label */}
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 to-transparent px-6 pb-6 pt-16 md:px-8 md:pb-8">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                        AA Kurmawa Automobiles
                      </p>

                      <p className="mt-2 font-serif text-2xl tracking-[-0.03em] text-white md:text-3xl">
                        {chairmanName}
                      </p>
                    </div>

                    <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">
                      04 — 01
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Information */}
            <Reveal delay={0.12}>
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-black/55">
                    Chairman
                  </p>

                  <h3 className="mt-6 max-w-xl font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-6xl md:text-7xl">
                    {chairmanName}
                  </h3>

                  <div className="mt-10 border-t border-black/10 pt-8">
                    <p className="max-w-xl text-base leading-8 text-black/60 md:text-lg md:leading-9">
                      {chairmanBio}
                    </p>
                  </div>
                </div>

                <div className="mt-16">
                  {/* Metadata */}
                  <div className="border-y border-black/10">
                    <div className="grid grid-cols-2">
                      <div className="border-r border-black/10 py-6 pr-5">
                        <p className="text-[9px] uppercase tracking-[0.25em] text-black/55">
                          Position
                        </p>

                        <p className="mt-3 text-sm text-black">
                          Chairman
                        </p>
                      </div>

                      <div className="py-6 pl-5">
                        <p className="text-[9px] uppercase tracking-[0.25em] text-black/55">
                          Company
                        </p>

                        <p className="mt-3 text-sm text-black">
                          AA Kurmawa Automobiles
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Editorial note */}
                  <div className="mt-10 flex items-start justify-between gap-8 border-b border-black/10 pb-6">
                    <p className="max-w-sm text-[10px] uppercase leading-5 tracking-[0.2em] text-black/50">
                      Leadership rooted in integrity, excellence and long-term
                      thinking.
                    </p>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/15">
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.1}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}