import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Vehicle } from "@/lib/vehicle-types";
import { getVehicleStatusLabel } from "@/lib/vehicle-status";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const statusLabel = getVehicleStatusLabel(vehicle.status);

  const statusStyles = {
    AVAILABLE: "border-white/35 bg-black/20 text-white",
    RESERVED: "border-amber-200/50 bg-black/40 text-white",
    SOLD: "border-white/25 bg-black/50 text-white/75",
  };

  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      aria-label={`View ${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
      className="group block text-current"
    >
      {/* VEHICLE PHOTOGRAPHY */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#deddd8]">
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 40vw"
            unoptimized
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[8px] uppercase tracking-[0.24em] text-black/40">
              Photography coming soon
            </p>
          </div>
        )}

        {/* SUBTLE PHOTOGRAPHIC CONTRAST */}
        {vehicle.image && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 transition-opacity duration-700 group-hover:opacity-80" />
        )}

        {/* STATUS AND YEAR */}
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-4 sm:left-5 sm:right-5 sm:top-5">
          <span
            className={`border px-3 py-2 text-[7px] font-medium uppercase tracking-[0.2em] backdrop-blur-md ${
              statusStyles[vehicle.status]
            }`}
          >
            {statusLabel}
          </span>

          <span className="pt-1 text-[8px] font-medium uppercase tracking-[0.2em] text-white">
            {vehicle.year}
          </span>
        </div>

        {/* IMAGE FOOTER */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 sm:bottom-5 sm:left-5 sm:right-5">
          <div className="flex min-w-0 flex-col gap-1">
            {vehicle.body && (
              <span className="text-[7px] uppercase tracking-[0.2em] text-white/85">
                {vehicle.body}
              </span>
            )}

            {vehicle.drivetrain && (
              <span className="text-[7px] uppercase tracking-[0.17em] text-white/65">
                {vehicle.drivetrain}
              </span>
            )}
          </div>

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-45 sm:h-11 sm:w-11">
            <ArrowUpRight size={17} strokeWidth={1.2} />
          </span>
        </div>
      </div>

      {/* VEHICLE INFORMATION */}
      <div className="border-b border-current/15 py-5 sm:py-6">
        <div className="flex items-start justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <p className="text-[8px] font-medium uppercase tracking-[0.24em] opacity-55">
              {vehicle.brand}
            </p>

            <h3 className="mt-2 break-words font-serif text-[1.6rem] leading-[0.96] tracking-[-0.04em] sm:text-[1.9rem]">
              {vehicle.model}
            </h3>
          </div>

          <div className="max-w-[45%] shrink-0 pt-0.5 text-right">
            <p className="text-[10px] font-medium leading-relaxed tracking-[-0.01em] sm:text-xs">
              {vehicle.price}
            </p>

            {vehicle.mileage && (
              <p className="mt-2 text-[7px] uppercase tracking-[0.15em] opacity-50 sm:text-[8px]">
                {vehicle.mileage}
              </p>
            )}
          </div>
        </div>

        {/* ESSENTIAL SPECIFICATIONS */}
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-current/10 pt-4 sm:gap-x-4">
          {vehicle.transmission && (
            <span className="text-[7px] uppercase tracking-[0.15em] opacity-60 sm:text-[8px]">
              {vehicle.transmission}
            </span>
          )}

          {vehicle.transmission && vehicle.fuel && (
            <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-current opacity-30" />
          )}

          {vehicle.fuel && (
            <span className="text-[7px] uppercase tracking-[0.15em] opacity-60 sm:text-[8px]">
              {vehicle.fuel}
            </span>
          )}

          {vehicle.engine && (
            <>
              {(vehicle.transmission || vehicle.fuel) && (
                <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-current opacity-30" />
              )}

              <span className="max-w-full truncate text-[7px] uppercase tracking-[0.15em] opacity-60 sm:text-[8px]">
                {vehicle.engine}
              </span>
            </>
          )}
        </div>

        {/* SECONDARY LINK CUE */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-[8px] uppercase tracking-[0.2em] opacity-40">
            AA Kurmawa Automobiles
          </span>

          <span className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.18em] opacity-60 transition-opacity duration-300 group-hover:opacity-100">
            View vehicle
            <ArrowUpRight
              size={13}
              strokeWidth={1.2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
