import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getPublishedVehicles } from "@/lib/queries/vehicles";
import type { Vehicle } from "@/lib/vehicle-types";
import { Reveal } from "@/components/Reveal";

function VehicleImage({ vehicle }: { vehicle: Vehicle }) {
  const image =
    vehicle.images?.[0] ||
    vehicle.image ||
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=90";

  return (
    <Image
      src={image}
      alt={`${vehicle.brand} ${vehicle.model}`}
      fill
      sizes="(max-width: 768px) 100vw, 70vw"
      unoptimized
      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
    />
  );
}

function getVehicleName(vehicle: Vehicle) {
  const brand = vehicle.brand.trim();
  const model = vehicle.model.trim();

  if (model.toLowerCase().startsWith(brand.toLowerCase())) {
    return model;
  }

  return `${brand} ${model}`;
}

function CollectionVehicle({
  vehicle,
  index,
}: {
  vehicle: Vehicle;
  index: number;
}) {
  const vehicleName = getVehicleName(vehicle);

  const isLead = index === 0;

  return (
    <Reveal delay={index * 0.08}>
      <Link
        href={`/vehicles/${vehicle.slug}`}
        className="group block"
      >
        <article>
          <div
            className={`relative overflow-hidden bg-[#e5e2dc] ${
              isLead
                ? "aspect-[16/9]"
                : "aspect-[4/3]"
            }`}
          >
            <VehicleImage vehicle={vehicle} />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />

            <div className="absolute left-5 top-5 md:left-7 md:top-7">
              <span className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/70">
                {vehicle.status}
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 md:bottom-7 md:left-7 md:right-7">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.28em] text-white/55">
                    {vehicle.year} · {vehicle.body || "Automobile"}
                  </p>

                  <h3
                    className={`mt-2 font-serif leading-[0.9] tracking-[-0.035em] text-white ${
                      isLead
                        ? "text-3xl md:text-5xl"
                        : "text-2xl md:text-3xl"
                    }`}
                  >
                    {vehicleName}
                  </h3>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/35 bg-black/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-b border-black/10 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {vehicle.mileage && (
                <span className="text-[9px] uppercase tracking-[0.18em] text-black/45">
                  {vehicle.mileage}
                </span>
              )}

              {vehicle.transmission && (
                <span className="text-[9px] uppercase tracking-[0.18em] text-black/45">
                  {vehicle.transmission}
                </span>
              )}

              {vehicle.fuel && (
                <span className="text-[9px] uppercase tracking-[0.18em] text-black/45">
                  {vehicle.fuel}
                </span>
              )}
            </div>

            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-black">
              {vehicle.price}
            </span>
          </div>
        </article>
      </Link>
    </Reveal>
  );
}

export async function HomeCollection() {
  
  const vehicles = await getPublishedVehicles();

 const featuredVehicles = vehicles
  .filter((vehicle) => vehicle.featured)
  .sort((a, b) => {
    const aUpdated = a.updatedAt
      ? new Date(a.updatedAt).getTime()
      : 0;

    const bUpdated = b.updatedAt
      ? new Date(b.updatedAt).getTime()
      : 0;

    return bUpdated - aUpdated;
  })
  .slice(0, 4);

  const collection =
    featuredVehicles.length > 0
      ? featuredVehicles
      : vehicles.slice(0, 4);

  return (
    <section
      id="collection"
      className="bg-[#f3f1ec] text-black"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 md:px-10 md:py-32 lg:px-14 lg:py-40">
        {/* Section header */}
        <Reveal>
          <div className="border-t border-black/15 pt-5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-black/45">
                02 — The Collection
              </p>

              <Link
                href="/vehicles"
                className="group hidden items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.22em] sm:inline-flex"
              >
                View all vehicles

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Introduction */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-24">
          <Reveal>
            <div>
              <p className="mb-7 text-[9px] font-medium uppercase tracking-[0.3em] text-black/45">
                Current selection
              </p>

              <h2 className="max-w-5xl font-serif text-[clamp(4rem,8vw,8.5rem)] leading-[0.8] tracking-[-0.055em]">
                Selected
                <br />
                with intention.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="max-w-md lg:pb-2">
              <p className="text-sm leading-7 text-black/55 md:text-base">
                A considered selection of new and pre-owned vehicles,
                presented with clarity and chosen for condition,
                character and value.
              </p>

              <Link
                href="/vehicles"
                className="group mt-8 inline-flex items-center gap-4 border-b border-black/25 pb-2 text-[9px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 hover:border-black sm:hidden"
              >
                View all vehicles

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Collection */}
        {collection.length > 0 ? (
          <div className="mt-20 grid gap-x-8 gap-y-20 md:grid-cols-12 md:gap-y-28 lg:mt-24">
            {collection.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className={
                  index === 0
                    ? "md:col-span-8"
                    : index === 1
                      ? "md:col-span-4 md:mt-28"
                      : index === 2
                        ? "md:col-span-5"
                        : "md:col-span-7 md:mt-28"
                }
              >
                <CollectionVehicle
                  vehicle={vehicle}
                  index={index}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-20 border-y border-black/10 py-24 text-center">
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
              Collection coming soon
            </p>
          </div>
        )}

        {/* Closing line */}
        <Reveal delay={0.15}>
          <div className="mt-24 border-t border-black/15 pt-6 md:mt-32">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[0.28em] text-black/35">
                  The collection changes.
                </p>

                <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-black/35">
                  The standard remains.
                </p>
              </div>

              <Link
                href="/vehicles"
                className="group inline-flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.22em]"
              >
                Explore the collection

                <span className="flex h-8 w-8 items-center justify-center border border-black/20 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}