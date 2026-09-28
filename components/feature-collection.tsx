import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getPublishedVehicles } from "@/lib/queries/vehicles";
import { getVehicleStatusLabel } from "@/lib/vehicle-status";

export default async function FeaturedCollection() {
  const featuredVehicles = (await getPublishedVehicles())
    .filter((vehicle) => vehicle.featured)
    .slice(0, 3);

  if (featuredVehicles.length === 0) {
    return null;
  }

  const [heroVehicle, ...secondaryVehicles] = featuredVehicles;

  return (
    <section
      id="vehicles"
      className="bg-[#f4f2ee] py-28 text-[#090b0d] md:py-36 lg:py-44"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-14">
        {/* SECTION INTRO */}
        <div className="mb-16 flex flex-col justify-between gap-10 md:mb-20 lg:flex-row lg:items-end">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-black/30" />

              <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-black/45">
                The Collection
              </p>
            </div>

            <h2 className="mt-7 text-5xl font-medium leading-[0.88] tracking-[-0.055em] md:text-7xl lg:text-[6.8rem]">
              Exceptional
              <br />
              vehicles.
            </h2>
          </div>

          <div className="max-w-sm lg:pb-2">
            <p className="text-sm leading-7 text-black/50">
              A considered selection of vehicles chosen for quality,
              specification and character.
            </p>

            <Link
              href="/vehicles"
              className="group mt-7 inline-flex items-center gap-3 border-b border-black/20 pb-2 text-[9px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 hover:border-black"
            >
              View complete collection

              <ArrowUpRight
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>

        {/* HERO VEHICLE */}
        <FeaturedVehicle
          vehicle={heroVehicle}
          featured
          index={0}
          total={featuredVehicles.length}
        />

        {/* SECONDARY VEHICLES */}
        {secondaryVehicles.length > 0 && (
          <div
            className={`mt-20 grid gap-x-10 gap-y-20 md:mt-28 ${
              secondaryVehicles.length === 1
                ? "lg:grid-cols-[1.15fr_0.85fr]"
                : "lg:grid-cols-2"
            }`}
          >
            {secondaryVehicles.map((vehicle, index) => (
              <FeaturedVehicle
                key={vehicle.id}
                vehicle={vehicle}
                index={index + 1}
                total={featuredVehicles.length}
              />
            ))}
          </div>
        )}

        {/* BOTTOM TRANSITION */}
        <div className="mt-24 border-t border-black/10 pt-8 md:mt-32">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-[8px] uppercase tracking-[0.24em] text-black/35">
                AA Kurmawa Automobiles
              </p>

              <p className="mt-3 max-w-md text-sm leading-6 text-black/45">
                A selection that reflects our commitment to quality,
                specification and service.
              </p>
            </div>

            <Link
              href="/vehicles"
              className="group flex w-fit items-center gap-4 text-[9px] font-medium uppercase tracking-[0.2em]"
            >
              Explore all vehicles

              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.4}
                  className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedVehicle({
  vehicle,
  featured = false,
  index = 0,
  total = 1,
}: {
  vehicle: Awaited<ReturnType<typeof getPublishedVehicles>>[number];
  featured?: boolean;
  index?: number;
  total?: number;
}) {
  const statusLabel = getVehicleStatusLabel(vehicle.status);

  const number = String(index + 1).padStart(2, "0");
  const totalNumber = String(total).padStart(2, "0");

  return (
    <article
      className="group"
      style={{
        animation: "featuredVehicleIn 800ms cubic-bezier(.22,1,.36,1) both",
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* EDITORIAL INDEX */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-px w-5 bg-black/20" />

          <span className="text-[8px] font-medium uppercase tracking-[0.22em] text-black/35">
            Featured vehicle
          </span>
        </div>

        <span className="text-[8px] font-medium tracking-[0.2em] text-black/30">
          {number} / {totalNumber}
        </span>
      </div>

      <Link
        href={`/vehicles/${vehicle.slug}`}
        className="block"
      >
        {/* IMAGE */}
        <div
         className={`relative overflow-hidden bg-[#deddd8] ${
        featured
          ? "aspect-[16/9]"
          : "aspect-[4/3]"
        }`}
        >
          <Image
            src={vehicle.image}
            alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
            fill
            priority={featured}
            sizes={
              featured
                ? "100vw"
                : "(max-width: 1024px) 100vw, 50vw"
            }
            unoptimized
            className={`object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] ${
              featured
                ? "group-hover:scale-[1.025]"
                : "group-hover:scale-[1.035]"
            }`}
          />

          {/* CINEMATIC GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-70" />

          {/* TOP INFORMATION */}
          <div className="absolute left-5 right-5 top-5 flex items-start justify-between md:left-7 md:right-7 md:top-7">
            <span
              className={`border px-3 py-2 text-[8px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md ${
                vehicle.status === "AVAILABLE"
                  ? "border-white/35 bg-black/15"
                  : vehicle.status === "RESERVED"
                  ? "border-white/35 bg-black/30"
                  : "border-white/25 bg-black/45 text-white/70"
              }`}
            >
              {statusLabel}
            </span>

            <span className="text-[9px] uppercase tracking-[0.2em] text-white/55">
              {vehicle.year}
            </span>
          </div>

          {/* IMAGE FOOTER */}
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between md:bottom-7 md:left-7 md:right-7">
            <div>
              <p className="text-[8px] uppercase tracking-[0.22em] text-white/55">
                {vehicle.body}
              </p>

              <p className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-white/80">
                {vehicle.drivetrain || "Automotive"}
              </p>
            </div>

            <div className="flex h-11 w-11 translate-y-4 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:h-12 md:w-12">
              <ArrowUpRight
                size={18}
                strokeWidth={1.4}
                className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </div>
        </div>

        {/* VEHICLE INFORMATION */}
        <div className="border-b border-black/10 py-7 md:py-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-[8px] font-medium uppercase tracking-[0.24em] text-black/40">
                {vehicle.brand}
              </p>

              <h3
                className={`mt-2 font-serif leading-none tracking-[-0.04em] ${
                  featured
                    ? "text-3xl md:text-4xl lg:text-[2.8rem]"
                    : "text-2xl md:text-3xl"
                }`}
              >
                {vehicle.model}
              </h3>
            </div>

            <div className="md:text-right">
              <p className="text-[11px] font-medium tracking-[-0.01em] md:text-xs">
                {vehicle.price}
              </p>

              <p className="mt-1.5 text-[8px] uppercase tracking-[0.16em] text-black/35">
                {vehicle.mileage}
              </p>
            </div>
          </div>

          {/* SPECS */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-black/8 pt-4">
            <span className="text-[8px] uppercase tracking-[0.16em] text-black/45">
              {vehicle.transmission}
            </span>

            <span className="h-1 w-1 rounded-full bg-black/20" />

            <span className="text-[8px] uppercase tracking-[0.16em] text-black/45">
              {vehicle.fuel}
            </span>

            {vehicle.engine && (
              <>
                <span className="h-1 w-1 rounded-full bg-black/20" />

                <span className="text-[8px] uppercase tracking-[0.16em] text-black/45">
                  {vehicle.engine}
                </span>
              </>
            )}

            <span className="ml-auto flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.17em] text-black/45 transition-colors duration-300 group-hover:text-black">
              View vehicle

              <ArrowUpRight
                size={13}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
