"use client";

import { Check } from "lucide-react";

const experiences = [
  "Vehicle inspection available",
  "Documentation support",
  "Trade-in enquiries welcome",
  "Showroom viewing available",
  "Personalised finance solutions",
  "Nationwide delivery options",
  "After-sales support",
  "Professional vehicle servicing",
];

const marqueeItems = [...experiences, ...experiences];

export function ExperienceMarquee() {
  return (
    <section className="overflow-hidden bg-[#d1d0cc] text-black">
      {/* Header */}
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24 lg:px-16">
        <div className="flex items-end justify-between gap-10">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-black/60">
              The AA Kurmawa Experience
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-[0.95] tracking-[-0.04em] md:text-5xl lg:text-6xl">
              More than a vehicle.
            </h2>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <span className="h-px w-14 bg-black/30" />

            <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-black/65">
              Driven by a higher standard
            </p>
          </div>
        </div>
      </div>

      {/* Moving experience band */}
      <div className="relative overflow-hidden border-y border-black/15">
        {/* Edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 md:w-24"
          style={{
            background:
              "linear-gradient(to right, #d1d0cc 0%, rgba(209,208,204,0) 100%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 md:w-24"
          style={{
            background:
              "linear-gradient(to left, #d1d0cc 0%, rgba(209,208,204,0) 100%)",
          }}
        />

        <div className="experience-marquee flex w-max">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex h-[104px] shrink-0 items-center border-r border-black/15 px-7 md:h-[116px] md:px-10 lg:px-12"
            >
              <div className="flex items-center gap-5 md:gap-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/30">
                  <Check
                    size={14}
                    strokeWidth={1.35}
                    className="text-black"
                  />
                </span>

                <span className="max-w-[190px] text-[12px] font-medium leading-5 text-black md:max-w-[215px] md:text-[13px]">
                  {item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing statement */}
      <div className="flex items-center justify-center px-6 py-12 md:py-14">
        <div className="flex items-center gap-5">
          <span className="h-px w-10 bg-black/25 md:w-16" />

          <p className="text-[8px] font-medium uppercase tracking-[0.32em] text-black/60 md:text-[9px]">
            Exceptional service at every stage
          </p>

          <span className="h-px w-10 bg-black/25 md:w-16" />
        </div>
      </div>

      <style jsx>{`
        .experience-marquee {
          animation: experience-scroll 36s linear infinite;
          will-change: transform;
        }

        .experience-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes experience-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @media (max-width: 768px) {
          .experience-marquee {
            animation-duration: 30s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .experience-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}