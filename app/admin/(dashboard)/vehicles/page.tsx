import Link from "next/link";
import {
  Plus,
  Search,
  ArrowUpRight,
  Car,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function AdminVehiclesPage() {
  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select(
      `
        id,
        slug,
        brand,
        model,
        year,
        price,
        currency,
        mileage,
        status,
        featured,
        published,
        created_at
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load vehicles:", error);
  }

  const inventory = vehicles ?? [];

  return (
    <main className="min-h-screen bg-[#f4f2ed]">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="flex min-h-20 items-center justify-between gap-6 px-6 lg:px-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Inventory
            </p>

            <h1 className="mt-1 font-serif text-2xl tracking-[-0.025em]">
              Vehicles
            </h1>
          </div>

          <Link
            href="/admin/vehicles/new"
            className="group flex items-center gap-3 bg-[#090b0d] px-5 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85"
          >
            <Plus size={14} strokeWidth={1.4} />
            Add vehicle
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-10 lg:px-10 lg:py-14">
        {/* Intro */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              Collection
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
              Your inventory.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-black/45">
              Manage every vehicle displayed across the AA Kurmawa digital
              showroom.
            </p>
          </div>

          <div className="flex items-center gap-3 border border-black/10 bg-white/30 px-4 py-3">
            <Car
              size={15}
              strokeWidth={1.3}
              className="text-black/35"
            />

            <span className="text-[9px] uppercase tracking-[0.2em] text-black/45">
              {inventory.length}{" "}
              {inventory.length === 1 ? "vehicle" : "vehicles"}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-12 flex flex-col gap-4 border-y border-black/10 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Search
              size={15}
              strokeWidth={1.3}
              className="text-black/30"
            />

            <input
              type="search"
              placeholder="Search vehicles"
              className="w-56 bg-transparent text-xs outline-none placeholder:text-black/30"
            />
          </div>

          <div className="flex gap-6">
            <button
              type="button"
              className="text-[9px] uppercase tracking-[0.18em] text-black"
            >
              All
            </button>

            <button
              type="button"
              className="text-[9px] uppercase tracking-[0.18em] text-black/35 transition-colors hover:text-black"
            >
              Available
            </button>

            <button
              type="button"
              className="text-[9px] uppercase tracking-[0.18em] text-black/35 transition-colors hover:text-black"
            >
              Reserved
            </button>

            <button
              type="button"
              className="text-[9px] uppercase tracking-[0.18em] text-black/35 transition-colors hover:text-black"
            >
              Sold
            </button>
          </div>
        </div>

        {/* Inventory */}
        {inventory.length === 0 ? (
          <div className="mt-8 border border-black/10 bg-white/20 px-6 py-20 text-center">
            <Car
              size={24}
              strokeWidth={1.2}
              className="mx-auto text-black/25"
            />

            <h3 className="mt-5 font-serif text-2xl">
              Your inventory is empty.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/40">
              Add your first vehicle to begin building the AA Kurmawa digital
              collection.
            </p>

            <Link
              href="/admin/vehicles/new"
              className="mt-7 inline-flex items-center gap-3 bg-[#090b0d] px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-white"
            >
              <Plus size={13} strokeWidth={1.4} />
              Add first vehicle
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden border border-black/10">
            {/* Table header */}
            <div className="hidden grid-cols-[2fr_1fr_1fr_0.8fr_0.8fr_40px] gap-6 border-b border-black/10 bg-black/[0.02] px-6 py-3 lg:grid">
              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Vehicle
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Price
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Mileage
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Status
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Visibility
              </span>

              <span />
            </div>

            {/* Rows */}
            {inventory.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/admin/vehicles/${vehicle.id}`}
                className="group grid gap-5 border-b border-black/10 px-6 py-6 transition-colors last:border-b-0 hover:bg-white/40 lg:grid-cols-[2fr_1fr_1fr_0.8fr_0.8fr_40px] lg:items-center lg:gap-6"
              >
                {/* Vehicle */}
                <div>
                  <div className="flex items-center gap-2">
                    {vehicle.featured && (
                      <span className="text-[7px] uppercase tracking-[0.16em] text-black/35">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-black/35">
                    {vehicle.year} · {vehicle.brand}
                  </p>

                  <h3 className="mt-1 font-serif text-xl tracking-[-0.02em]">
                    {vehicle.model}
                  </h3>
                </div>

                {/* Price */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Price
                  </p>

                  <p className="text-xs">
                    {vehicle.price
                      ? `${vehicle.currency ?? "NGN"} ${Number(
                          vehicle.price
                        ).toLocaleString()}`
                      : "Price on request"}
                  </p>
                </div>

                {/* Mileage */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Mileage
                  </p>

                  <p className="text-xs">
                    {vehicle.mileage
                      ? `${vehicle.mileage.toLocaleString()} km`
                      : "—"}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Status
                  </p>

                  <span
                    className={`inline-flex border px-2.5 py-1 text-[8px] uppercase tracking-[0.14em] ${
                      vehicle.status === "AVAILABLE"
                        ? "border-emerald-900/10 bg-emerald-50 text-emerald-800"
                        : vehicle.status === "RESERVED"
                          ? "border-amber-900/10 bg-amber-50 text-amber-800"
                          : "border-black/10 bg-black/5 text-black/45"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </div>

                {/* Visibility */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Visibility
                  </p>

                  <span className="text-[9px] uppercase tracking-[0.14em] text-black/45">
                    {vehicle.published ? "Published" : "Hidden"}
                  </span>
                </div>

                {/* Arrow */}
                <div className="hidden justify-end lg:flex">
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.3}
                    className="text-black/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}