"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";

type HomeChairmanProps = {
  name?: string | null;
  image?: string | null;
  bio?: string | null;
};


export function HomeChairman({
  name,
  image,
  bio,
}: HomeChairmanProps) {
  const chairmanName = name || "Auwal Ahmad";
  const chairmanImage = image;

  const [imageFailed, setImageFailed] = useState(false);

useEffect(() => {
  setImageFailed(false);
}, [chairmanImage]);

  return (
    <section
      id="chairman"
      className="bg-[#f3f1ec] text-black"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:py-28 md:px-10 md:py-36 lg:px-14 lg:py-44">
        <Reveal>
          <div className="flex items-center justify-between border-b border-black/10 pb-5">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-black/45">
              04 — Leadership
            </p>

            <p className="hidden text-[8px] uppercase tracking-[0.25em] text-black/30 sm:block">
              AA Kurmawa Automobiles Nig. Ltd
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <p className="text-[9px] uppercase tracking-[0.28em] text-black/40">
                The person behind the vision
              </p>

              <h2 className="mt-7 max-w-xl font-serif text-[clamp(3.7rem,7vw,7.5rem)] leading-[0.84] tracking-[-0.055em]">
                A name behind
                <br />
                the standard.
              </h2>

              <div className="mt-8">
                <p className="font-serif text-2xl tracking-[-0.025em] md:text-3xl">
                  {chairmanName}
                </p>

                <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.25em] text-black/40">
                  Chairman
                </p>
              </div>

              <p className="mt-7 max-w-md text-sm leading-7 text-black/55 md:text-base">
                {bio}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div>
             <div className="group relative block aspect-[4/5] overflow-hidden bg-[#b2b6b1]">
{chairmanImage && !imageFailed ? (
    <>
      <Image
        src={chairmanImage}
        alt={`${chairmanName}, Chairman of AA Kurmawa Automobiles`}
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        unoptimized
        onError={() => setImageFailed(true)}
        className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6 md:bottom-8 md:left-8 md:right-8">
        <div>
          <p className="text-[8px] uppercase tracking-[0.25em] text-white/60">
            Leadership
          </p>

          <p className="mt-2 font-serif text-2xl tracking-[-0.025em] text-white md:text-3xl">
            {chairmanName}
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/35 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
          <ArrowUpRight
            size={15}
            strokeWidth={1.1}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </>
  ) : (
    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-medium uppercase tracking-[0.28em] text-black/40">
          Leadership
        </span>

        <span className="text-[8px] uppercase tracking-[0.25em] text-black/25">
          Portrait 01
        </span>
      </div>

      <div>
        <div className="mb-6 h-px w-12 bg-black/20" />

        <p className="font-serif text-3xl leading-none tracking-[-0.04em] text-black/80 md:text-4xl">
          Portrait
          <br />
          coming soon.
        </p>

        <p className="mt-4 max-w-xs text-[9px] uppercase leading-5 tracking-[0.2em] text-black/40">
          A portrait of the Chairman will appear here.
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-black/10 pt-4">
        <span className="text-[8px] uppercase tracking-[0.25em] text-black/30">
          AA Kurmawa Automobiles
        </span>

        <span className="text-[8px] uppercase tracking-[0.25em] text-black/30">
          Kano · Nigeria
        </span>
      </div>
    </div>
  )}
</div>

              <div className="flex flex-col gap-4 border-b border-black/10 py-5 sm:flex-row sm:items-start sm:justify-between">
                <p className="max-w-md text-[9px] uppercase leading-5 tracking-[0.2em] text-black/40">
                  Integrity in leadership.
                  <br />
                  Excellence in every direction.
                </p>

                <p className="text-[8px] uppercase tracking-[0.25em] text-black/30">
                  Kano · Nigeria
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}