import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

import { getPublishedVehicles } from "@/lib/queries/vehicles";
import { VehicleFilters } from "@/components/VehicleFilters";

export default async function VehiclesPage() {
  const publicVehicles =
    await getPublishedVehicles();

  return (
    <main className="min-h-screen bg-[#f4f2ee] text-[#090b0d]">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-6 md:px-10 md:py-8">
          <Link
            href="/"
            className="group flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.18em] text-black/60 transition hover:text-black"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            AA Kurmawa
          </Link>

          <span className="text-[9px] uppercase tracking-[.2em] text-black/35">
            Kano · Nigeria
          </span>
        </div>
      </header>

      {/* =========================================================
          INTRO
      ========================================================= */}

      <section className="px-5 pb-20 pt-24 md:px-10 md:pb-28 md:pt-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[.25em] text-black/45">
                Current stock
              </p>

              <h1 className="mt-5 max-w-5xl text-6xl font-medium leading-[.84] tracking-[-.055em] md:text-8xl lg:text-[9rem]">
                The
                <br />
                collection.
              </h1>

              <p className="mt-8 max-w-xl text-sm leading-7 text-black/50">
                Discover our curated selection
                of new and pre-owned vehicles,
                carefully selected for quality,
                performance and value.
              </p>
            </div>

            {/* Inventory Count */}
            <div className="flex items-center gap-3 border-t border-black/15 pt-4 lg:min-w-[220px]">
              <span className="text-3xl font-medium tracking-[-.04em]">
                {publicVehicles.length}
              </span>

              <span className="text-[9px] uppercase tracking-[.18em] text-black/45">
                Vehicles available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FILTERS + RESULTS
      ========================================================= */}

      <VehicleFilters
        vehicles={publicVehicles}
      />

      {/* =========================================================
          BOTTOM CTA
      ========================================================= */}

      <section className="bg-[#090b0d] px-5 py-28 text-white md:px-10 md:py-40">
        <div className="mx-auto max-w-[1100px] text-center">
          <p className="text-[9px] uppercase tracking-[.25em] text-white/40">
            Can&apos;t find what you&apos;re
            looking for?
          </p>

          <h2 className="mt-6 text-5xl font-medium leading-[.88] tracking-[-.05em] md:text-7xl lg:text-8xl">
            Let us find it
            <br />
            for you.
          </h2>

          <a
            href="https://wa.me/2347077773521?text=Hello%20AA%20Kurmawa%20Automobiles%2C%20I%27m%20looking%20for%20a%20vehicle.%20Please%20assist%20me."
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-4 bg-white px-7 py-4 text-[10px] font-semibold uppercase tracking-[.18em] text-black transition hover:bg-white/85"
          >
            Speak with our team

            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </div>
      </section>
    </main>
  );
}