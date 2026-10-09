import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

import { getPublishedVehicles } from "@/lib/queries/vehicles";
import { VehicleFilters } from "@/components/VehicleFilters";
import { VehicleCard } from "@/components/VehicleCard";

export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  const publicVehicles = await getPublishedVehicles();

  const featuredVehicles = publicVehicles.filter(
    (vehicle) => vehicle.featured
  );

  return (
    <main className="min-h-screen bg-[#f4f2ee] text-[#090b0d]">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-6 md:px-10 md:py-8 lg:px-14">
          <Link
            href="/"
            className="group flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black/60 transition-colors hover:text-black"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.2}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            AA Kurmawa
          </Link>

          <span className="text-[9px] uppercase tracking-[0.2em] text-black/35">
            Kano · Nigeria
          </span>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="overflow-hidden px-5 pb-24 pt-24 md:px-10 md:pb-32 md:pt-32 lg:px-14 lg:pb-40 lg:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-14 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-24">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-black/40">
                01 — Current Stock
              </p>

              <h1 className="mt-7 max-w-6xl font-serif text-[clamp(4.5rem,12vw,11rem)] leading-[0.78] tracking-[-0.065em]">
                The
                <br />
                collection.
              </h1>

              <p className="mt-10 max-w-xl text-sm leading-7 text-black/50 md:text-base md:leading-8">
                A considered collection of new and pre-owned vehicles,
                selected with care for quality, performance and value.
              </p>
            </div>

            {/* Inventory metadata */}
            <div className="lg:pb-2">
              <div className="border-t border-black/15 pt-5 lg:min-w-[250px]">
                <div className="flex items-end justify-between gap-8">
                  <div>
                    <p className="text-5xl font-medium leading-none tracking-[-0.05em] md:text-6xl">
                      {publicVehicles.length
                        .toString()
                        .padStart(2, "0")}
                    </p>

                    <p className="mt-3 text-[8px] uppercase tracking-[0.25em] text-black/40">
                      Current vehicles
                    </p>
                  </div>

                  <span className="pb-1 text-[8px] uppercase tracking-[0.2em] text-black/30">
                    Kano
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial metadata */}
          <div className="mt-20 flex flex-col gap-4 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between md:mt-28">
            <p className="text-[8px] uppercase tracking-[0.28em] text-black/30">
              New · Pre-Owned · Selected
            </p>

            <p className="text-[8px] uppercase tracking-[0.28em] text-black/30">
              Browse the current collection
            </p>
          </div>
        </div>
      </section>

          
          {/* CURRENT STOCK*/}

      <section
        id="current-stock"
        className="px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[0.55fr_1.45fr] md:gap-24">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-black/40">
                {featuredVehicles.length > 0
                  ? "03 — Current Stock"
                  : "02 — Current Stock"}
              </p>
            </div>

            <div>
              <h2 className="max-w-5xl font-serif text-4xl leading-[0.95] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-7xl">
                Find your
                <br />
                next vehicle.
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-black/45">
                Explore the vehicles currently available through
                AA Kurmawa Automobiles.
              </p>
            </div>
          </div>

          <VehicleFilters vehicles={publicVehicles} />
        </div>
      </section>

      {/* =========================================================
          SOURCING CTA
      ========================================================= */}

      <section className="bg-[#090b0d] px-5 py-28 text-white md:px-10 md:py-40 lg:px-14">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-14 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/35">
                04 — Vehicle sourcing
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-10 bg-white/20" />

                <span className="text-[8px] uppercase tracking-[0.25em] text-white/30">
                  Looking for something specific?
                </span>
              </div>
            </div>

            <div>
              <h2 className="max-w-5xl font-serif text-5xl leading-[0.88] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[7rem]">
                Let us find
                <br />
                it for you.
              </h2>

              <p className="mt-8 max-w-xl text-sm leading-7 text-white/45 md:text-base md:leading-8">
                Tell our team what you are looking for and we can help
                you explore suitable options.
              </p>

              <a
                href="https://wa.me/2348147384048?text=Hello%20AA%20Kurmawa%20Automobiles%2C%20I%27m%20looking%20for%20a%20vehicle.%20Please%20assist%20me."
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-4 border-b border-white/25 pb-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:border-white"
              >
                Speak with our team

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}