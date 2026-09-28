"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  MapPin,
  Phone,
  Clock3,
} from "lucide-react";

import { Reveal } from "@/components/Reveal";

type HomeShowroomProps = {
  businessName: string;
  address: string;
  phone: string;
  openingHours?: string | null;
  showroomImage: string;
};

export function HomeShowroom({
  businessName,
  address,
  phone,
  openingHours,
  showroomImage,
}: HomeShowroomProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  const [imageFailed, setImageFailed] = useState(false);

useEffect(() => {
  setImageFailed(false);
}, [showroomImage]);

  return (
    <section
      id="showroom"
      className="bg-[#f0ede2e5] text-black"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:py-24 md:px-10 md:py-32 lg:px-14 lg:py-10">
        {/* Section header */}
        <Reveal>
          <div className="border-t border-black/15 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-black/45 md:text-[9px]">
                08 — Showroom
              </p>

              <p className="hidden text-[8px] uppercase tracking-[0.28em] text-black/35 sm:block">
                AA Kurmawa Automobiles
              </p>
            </div>
          </div>
        </Reveal>

        {/* Intro */}
        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <Reveal>
            <div>
              <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.3em] text-black/45">
                Come see it for yourself.
              </p>

              <h2 className="max-w-5xl font-serif text-[clamp(3.6rem,7.5vw,8rem)] leading-[0.82] tracking-[-0.055em] text-black">
                Where the
                <br />
                experience
                <br />
                becomes real.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-md lg:pb-2">
              <p className="text-sm leading-7 text-black/60 md:text-base">
                Visit {businessName} in Kano and experience our vehicles,
                service and team in person. Whether you are looking for your
                next vehicle or simply want to speak with our team, we are
                here to help.
              </p>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-8 inline-flex items-center gap-3 border-b border-black/30 pb-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-black transition-colors hover:border-black"
              >
                Get directions
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Showroom image */}
<Reveal delay={0.12}>
  <div className="relative mt-14 aspect-[16/9] overflow-hidden bg-[#b2b6b1] sm:mt-20 lg:mt-24">
    {showroomImage && !imageFailed ? (
      <>
        <Image
          src={showroomImage}
          alt={`${businessName} showroom`}
          fill
          sizes="(max-width: 768px) 100vw, 1600px"
          unoptimized
          onError={() => setImageFailed(true)}
          className="object-cover transition-transform duration-1000 hover:scale-[1.015]"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 sm:p-7 md:p-10">
          <div>
            <p className="text-[8px] uppercase tracking-[0.28em] text-white/65">
              Visit us
            </p>

            <p className="mt-2 max-w-sm text-sm leading-6 text-white md:text-base">
              Kano, Nigeria
            </p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open showroom location in Google Maps"
            className="group flex h-11 w-11 items-center justify-center border border-white/35 bg-black/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black"
          >
            <ArrowUpRight
              size={16}
              strokeWidth={1.2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </>
    ) : (
      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10">
        {/* Top */}
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-black/40">
            Showroom
          </p>

          <p className="text-[8px] uppercase tracking-[0.28em] text-black/25">
            Photography 01
          </p>
        </div>

        {/* Center */}
        <div className="max-w-xl">
          <div className="mb-7 h-px w-14 bg-black/20" />

          <p className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] tracking-[-0.045em] text-black/80">
            The showroom
            <br />
            awaits.
          </p>

          <p className="mt-5 max-w-sm text-[9px] uppercase leading-5 tracking-[0.2em] text-black/40">
            Professional showroom photography will appear here soon.
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-black/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-black/30">
              Visit us
            </p>

            <p className="mt-2 text-sm text-black/65">
              Kano, Nigeria
            </p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open showroom location in Google Maps"
            className="group inline-flex items-center gap-3 text-[8px] font-semibold uppercase tracking-[0.24em] text-black"
          >
            Get directions

            <span className="flex h-9 w-9 items-center justify-center border border-black/20 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
              <ArrowUpRight
                size={13}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        </div>
      </div>
    )}
  </div>
</Reveal>
      
        {/* Information strip */}
        <div className="mt-8 grid border-y border-black/15 md:grid-cols-3">
          {/* Address */}
          <Reveal>
            <div className="border-b border-black/15 py-7 md:border-b-0 md:border-r md:pr-10">
              <div className="flex items-start gap-4">
                <MapPin
                  size={16}
                  strokeWidth={1.1}
                  className="mt-0.5 shrink-0 text-black/45"
                />

                <div>
                  <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-black/40">
                    Address
                  </p>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-black/70">
                    {address}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Phone */}
          <Reveal delay={0.08}>
            <div className="border-b border-black/15 py-7 md:border-b-0 md:border-r md:px-10">
              <div className="flex items-start gap-4">
                <Phone
                  size={16}
                  strokeWidth={1.1}
                  className="mt-0.5 shrink-0 text-black/45"
                />

                <div>
                  <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-black/40">
                    Call us
                  </p>

                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="mt-3 inline-block text-sm text-black transition-opacity hover:opacity-60"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Opening hours */}
          <Reveal delay={0.16}>
            <div className="py-7 md:pl-10">
              <div className="flex items-start gap-4">
                <Clock3
                  size={16}
                  strokeWidth={1.1}
                  className="mt-0.5 shrink-0 text-black/45"
                />

                <div>
                  <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-black/40">
                    Opening hours
                  </p>

                  <p className="mt-3 text-sm leading-6 text-black/70">
                    {openingHours || "Contact us for current opening hours."}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom line */}
        <Reveal delay={0.2}>
          <div className="mt-16 flex flex-col gap-6 border-t border-black/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.28em] text-black/40">
                Your next visit starts here.
              </p>

              <p className="mt-2 text-xs text-black/55">
                AA Kurmawa · Kano, Nigeria
              </p>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-4 self-start text-[9px] font-semibold uppercase tracking-[0.24em] text-black"
            >
              Visit the showroom
              <span className="flex h-8 w-8 items-center justify-center border border-black/20 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}