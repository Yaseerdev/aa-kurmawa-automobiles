import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Vehicle } from "@/lib/vehicle-types";
import { getVehicleStatusLabel } from "@/lib/vehicle-status";

export function VehicleCard({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  const statusLabel = getVehicleStatusLabel(vehicle.status);

  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className="group block"
    >
      {/* =========================================================
          IMAGE
      ========================================================= */}

      <div className="relative aspect-[4/3] overflow-hidden bg-[#deddd8]">
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-1000 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.055]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#deddd8]">
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-[0.24em] text-black/30">
                Photography coming soon
              </p>
            </div>
          </div>
        )}

        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-70" />

        {/* Top metadata */}
        <div className="absolute left-5 right-5 top-5 flex items-start justify-between md:left-6 md:right-6 md:top-6">
          {/* Status */}
          <span
            className={`border px-3 py-2 text-[8px] font-medium uppercase tracking-[0.2em] backdrop-blur-md ${
              vehicle.status === "AVAILABLE"
                ? "border-white/35 bg-black/15 text-white"
                : vehicle.status === "RESERVED"
                ? "border-white/35 bg-black/30 text-white"
                : "border-white/25 bg-black/45 text-white/70"
            }`}
          >
            {statusLabel}
          </span>

          {/* Vehicle year */}
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/55">
            {vehicle.year}
          </span>
        </div>

        {/* Bottom image information */}
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between md:bottom-6 md:left-6 md:right-6">
          <div>
            <p className="text-[8px] uppercase tracking-[0.22em] text-white/55">
              {vehicle.body}
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/80">
              {vehicle.drivetrain || "Automotive"}
            </p>
          </div>

          {/* View button */}
          <div className="flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight
              size={18}
              strokeWidth={1.4}
              className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </div>

      {/* =========================================================
          INFORMATION
      ========================================================= */}

      <div className="border-b border-black/10 py-6 md:py-7">
        <div className="flex items-start justify-between gap-6">
          {/* Name */}
          <div className="min-w-0">
            <p className="text-[8px] font-medium uppercase tracking-[0.24em] text-black/40">
              {vehicle.brand}
            </p>

            <h3 className="mt-2 font-serif text-[1.65rem] leading-none tracking-[-0.035em] text-[#090b0d] md:text-[1.9rem]">
              {vehicle.model}
            </h3>
          </div>

          {/* Price */}
          <div className="shrink-0 pt-0.5 text-right">
            <p className="text-[11px] font-medium tracking-[-0.01em] text-[#090b0d] md:text-xs">
              {vehicle.price}
            </p>

            <p className="mt-1.5 text-[8px] uppercase tracking-[0.16em] text-black/35">
              {vehicle.mileage}
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-6 flex items-center justify-between border-t border-black/8 pt-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
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
          </div>

          <span className="flex shrink-0 items-center gap-2 text-[8px] font-medium uppercase tracking-[0.17em] text-black/45 transition-colors duration-300 group-hover:text-black">
            View

            <ArrowUpRight
              size={13}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}