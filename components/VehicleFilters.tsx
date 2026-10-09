
"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
  ArrowDownUp,
} from "lucide-react";

import type { Vehicle } from "@/lib/vehicle-types";
import { VehicleCard } from "@/components/VehicleCard";

type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "year-newest"
  | "year-oldest";

type VehicleFiltersProps = {
  vehicles: Vehicle[];
};

function parsePrice(price: string) {
  const numeric = price.replace(/[^\d.]/g, "");
  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : null;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Recently added" },
  { value: "oldest", label: "Oldest added" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "year-newest", label: "Newest model year" },
  { value: "year-oldest", label: "Oldest model year" },
];

export function VehicleFilters({ vehicles }: VehicleFiltersProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("ALL");
  const [model, setModel] = useState("ALL");
  const [body, setBody] = useState("ALL");
  const [year, setYear] = useState("ALL");
  const [transmission, setTransmission] = useState("ALL");
  const [fuel, setFuel] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const brands = useMemo(
    () =>
      Array.from(
        new Set(vehicles.map((vehicle) => vehicle.brand).filter(Boolean))
      ).sort(),
    [vehicles]
  );

  const models = useMemo(() => {
    const source =
      brand === "ALL"
        ? vehicles
        : vehicles.filter((vehicle) => vehicle.brand === brand);

    return Array.from(
      new Set(source.map((vehicle) => vehicle.model).filter(Boolean))
    ).sort();
  }, [vehicles, brand]);

  const bodies = useMemo(
    () =>
      Array.from(
        new Set(vehicles.map((vehicle) => vehicle.body).filter(Boolean))
      ).sort(),
    [vehicles]
  );

  const transmissions = useMemo(
    () =>
      Array.from(
        new Set(
          vehicles.map((vehicle) => vehicle.transmission).filter(Boolean)
        )
      ).sort(),
    [vehicles]
  );

  const fuels = useMemo(
    () =>
      Array.from(
        new Set(vehicles.map((vehicle) => vehicle.fuel).filter(Boolean))
      ).sort(),
    [vehicles]
  );

  const years = useMemo(
    () =>
      Array.from(new Set(vehicles.map((vehicle) => vehicle.year))).sort(
        (a, b) => b - a
      ),
    [vehicles]
  );

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const minimumPrice =
      minPrice.trim() === ""
        ? null
        : Number(minPrice.replace(/[^\d.]/g, ""));

    const maximumPrice =
      maxPrice.trim() === ""
        ? null
        : Number(maxPrice.replace(/[^\d.]/g, ""));

    const result = vehicles.filter((vehicle) => {
      if (normalizedSearch) {
        const searchableText = [
          vehicle.brand,
          vehicle.model,
          vehicle.body,
          vehicle.year,
          vehicle.transmission,
          vehicle.fuel,
          vehicle.engine,
          vehicle.drivetrain,
          vehicle.exteriorColor,
          vehicle.interiorColor,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(normalizedSearch)) return false;
      }

      if (brand !== "ALL" && vehicle.brand !== brand) return false;
      if (model !== "ALL" && vehicle.model !== model) return false;
      if (body !== "ALL" && vehicle.body !== body) return false;
      if (year !== "ALL" && vehicle.year !== Number(year)) return false;

      if (
        transmission !== "ALL" &&
        vehicle.transmission !== transmission
      ) {
        return false;
      }

      if (fuel !== "ALL" && vehicle.fuel !== fuel) return false;
      if (status !== "ALL" && vehicle.status !== status) return false;

      const vehiclePrice = parsePrice(vehicle.price);

      if (minimumPrice !== null && Number.isFinite(minimumPrice)) {
        if (vehiclePrice === null || vehiclePrice < minimumPrice) {
          return false;
        }
      }

      if (maximumPrice !== null && Number.isFinite(maximumPrice)) {
        if (vehiclePrice === null || vehiclePrice > maximumPrice) {
          return false;
        }
      }

      return true;
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "price-low":
          return (
            (parsePrice(a.price) ?? Infinity) -
            (parsePrice(b.price) ?? Infinity)
          );

        case "price-high":
          return (
            (parsePrice(b.price) ?? -Infinity) -
            (parsePrice(a.price) ?? -Infinity)
          );

        case "year-newest":
          return b.year - a.year;

        case "year-oldest":
          return a.year - b.year;

        case "oldest":
          return (
            new Date(a.createdAt ?? 0).getTime() -
            new Date(b.createdAt ?? 0).getTime()
          );

        case "newest":
        default:
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          );
      }
    });
  }, [
    vehicles,
    search,
    brand,
    model,
    body,
    year,
    transmission,
    fuel,
    status,
    minPrice,
    maxPrice,
    sort,
  ]);

  const activeFilterCount = [
    search.trim() !== "",
    brand !== "ALL",
    model !== "ALL",
    body !== "ALL",
    year !== "ALL",
    transmission !== "ALL",
    fuel !== "ALL",
    status !== "ALL",
    minPrice.trim() !== "",
    maxPrice.trim() !== "",
  ].filter(Boolean).length;

  const hasFilters = activeFilterCount > 0 || sort !== "newest";

  function resetFilters() {
    setSearch("");
    setBrand("ALL");
    setModel("ALL");
    setBody("ALL");
    setYear("ALL");
    setTransmission("ALL");
    setFuel("ALL");
    setStatus("ALL");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
  }

  function handleBrandChange(value: string) {
    setBrand(value);
    setModel("ALL");
  }

  return (
    <>
      <section className="border-y border-black/10">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-14">
          <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="vehicle-filter-panel"
                className="group inline-flex min-h-10 items-center gap-3 text-[9px] font-medium uppercase tracking-[0.18em] text-black/70 transition-colors hover:text-black"
              >
                <SlidersHorizontal
                  size={15}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:rotate-90"
                />
                <span>{open ? "Close filters" : "Filter vehicles"}</span>
                <span className="flex h-6 min-w-6 items-center justify-center border border-black/15 px-1.5 text-[9px] tabular-nums">
                  {activeFilterCount}
                </span>
                <ChevronDown
                  size={13}
                  strokeWidth={1.3}
                  className={`transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[8px] uppercase tracking-[0.16em] text-black/45 transition-colors hover:text-black"
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <span className="text-[8px] uppercase tracking-[0.15em] text-black/40">
                {filteredVehicles.length}{" "}
                {filteredVehicles.length === 1 ? "vehicle" : "vehicles"}
              </span>

              <span className="hidden h-4 w-px bg-black/15 sm:block" />

              <label className="flex items-center gap-2">
                <ArrowDownUp
                  size={12}
                  strokeWidth={1.3}
                  className="text-black/40"
                />
                <span className="sr-only">Sort vehicles</span>
                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as SortOption)
                  }
                  className="max-w-[145px] cursor-pointer bg-transparent py-2 text-[8px] uppercase tracking-[0.1em] text-black/65 outline-none focus:text-black sm:max-w-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div
            id="vehicle-filter-panel"
            aria-hidden={!open}
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                className={`border-t border-black/10 py-8 transition-[transform] duration-300 md:py-10 ${
                  open ? "translate-y-0" : "-translate-y-2"
                }`}
              >
                <div className="grid gap-8 lg:grid-cols-[1.1fr_1.9fr] lg:gap-12">
                  <div>
                    <p className="mb-3 text-[8px] uppercase tracking-[0.2em] text-black/40">
                      Search the collection
                    </p>
                    <div className="relative">
                      <Search
                        size={15}
                        strokeWidth={1.3}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                      />
                      <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Make, model or keyword"
                        className="h-12 w-full border border-black/15 bg-white/50 pl-11 pr-10 text-sm text-black outline-none transition-colors placeholder:text-black/35 focus:border-black/45"
                      />
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          aria-label="Clear search"
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black/40 hover:text-black"
                        >
                          <X size={14} strokeWidth={1.3} />
                        </button>
                      )}
                    </div>
                    <p className="mt-3 text-[8px] leading-5 text-black/40">
                      Search vehicle details, specifications and colours.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
                    <FilterSelect
                      label="Make"
                      value={brand}
                      onChange={handleBrandChange}
                      options={brands}
                    />
                    <FilterSelect
                      label="Model"
                      value={model}
                      onChange={setModel}
                      options={models}
                      disabled={brand !== "ALL" && models.length === 0}
                    />
                    <FilterSelect
                      label="Body type"
                      value={body}
                      onChange={setBody}
                      options={bodies}
                    />
                    <FilterSelect
                      label="Year"
                      value={year}
                      onChange={setYear}
                      options={years.map(String)}
                    />
                    <FilterSelect
                      label="Transmission"
                      value={transmission}
                      onChange={setTransmission}
                      options={transmissions}
                    />
                    <FilterSelect
                      label="Fuel"
                      value={fuel}
                      onChange={setFuel}
                      options={fuels}
                    />
                    <FilterSelect
                      label="Availability"
                      value={status}
                      onChange={setStatus}
                      options={["AVAILABLE", "RESERVED", "SOLD"]}
                      displayLabels={{
                        AVAILABLE: "Available",
                        RESERVED: "Reserved",
                        SOLD: "Sold",
                      }}
                    />
                  </div>
                </div>

                <div className="mt-8 border-t border-black/10 pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="mb-3 text-[8px] uppercase tracking-[0.2em] text-black/40">
                        Price range · NGN
                      </p>
                      <div className="grid max-w-xl grid-cols-2 gap-3">
                        <label className="block">
                          <span className="sr-only">Minimum price</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={minPrice}
                            onChange={(event) =>
                              setMinPrice(event.target.value)
                            }
                            placeholder="Minimum price"
                            className="h-11 w-full border border-black/15 bg-white/50 px-3 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/45"
                          />
                        </label>
                        <label className="block">
                          <span className="sr-only">Maximum price</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={maxPrice}
                            onChange={(event) =>
                              setMaxPrice(event.target.value)
                            }
                            placeholder="Maximum price"
                            className="h-11 w-full border border-black/15 bg-white/50 px-3 text-sm text-black outline-none placeholder:text-black/35 focus:border-black/45"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-[9px] text-black/45">
                        Showing{" "}
                        <span className="font-medium text-black">
                          {filteredVehicles.length}
                        </span>{" "}
                        of {vehicles.length}
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex min-h-11 items-center gap-2 border border-black/15 px-4 text-[8px] font-medium uppercase tracking-[0.15em] text-black/65 transition-colors hover:border-black/40 hover:text-black"
                      >
                        <RotateCcw size={12} strokeWidth={1.3} />
                        Clear filters
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="inline-flex min-h-11 items-center justify-center bg-[#090b0d] px-5 text-[8px] font-medium uppercase tracking-[0.17em] text-white transition-opacity hover:opacity-80"
                      >
                        Show {filteredVehicles.length}{" "}
                        {filteredVehicles.length === 1 ? "vehicle" : "vehicles"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 pt-12 md:px-10 md:pb-28 md:pt-16 lg:px-14 lg:pb-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.22em] text-black/40">
                AA Kurmawa Automobiles
              </p>
              <h2 className="mt-2 font-serif text-2xl tracking-[-0.035em] sm:text-3xl">
                {hasFilters ? "Your results" : "The collection"}
              </h2>
            </div>
            <p className="pb-1 text-right text-[8px] uppercase tracking-[0.14em] text-black/40">
              {filteredVehicles.length}{" "}
              {filteredVehicles.length === 1 ? "vehicle" : "vehicles"}
            </p>
          </div>

          {filteredVehicles.length > 0 ? (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-16">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <NoResults hasFilters={hasFilters} onReset={resetFilters} />
          )}
        </div>
      </section>
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
  displayLabels,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  displayLabels?: Record<string, string>;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[8px] uppercase tracking-[0.17em] text-black/45">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none border border-black/15 bg-white/50 pl-3 pr-8 text-[9px] text-black/75 outline-none transition-colors focus:border-black/45 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <option value="ALL">All {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {displayLabels?.[option] ?? option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          strokeWidth={1.3}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40"
        />
      </span>
    </label>
  );
}

function NoResults({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset: () => void;
}) {
  return (
    <div className="border-y border-black/10 py-20 text-center md:py-28">
      <div className="mx-auto flex h-12 w-12 items-center justify-center border border-black/15">
        <Search size={17} strokeWidth={1.2} className="text-black/40" />
      </div>
      <p className="mt-6 text-[8px] uppercase tracking-[0.22em] text-black/45">
        No matching vehicles
      </p>
      <h3 className="mt-4 font-serif text-3xl leading-tight tracking-[-0.04em] md:text-4xl">
        Nothing matched your search.
      </h3>
      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-black/50">
        Try changing your filters or searching for a different make or model.
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="mt-7 inline-flex items-center gap-3 border-b border-black/25 pb-2 text-[8px] font-medium uppercase tracking-[0.18em] transition-colors hover:border-black"
        >
          <RotateCcw size={12} strokeWidth={1.3} />
          Clear all filters
        </button>
      )}
    </div>
  );
}
