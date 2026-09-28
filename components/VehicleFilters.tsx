"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
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

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function getYearRange(vehicles: Vehicle[]) {
  const years = vehicles
    .map((vehicle) => vehicle.year)
    .filter((year) => Number.isFinite(year));

  if (years.length === 0) {
    return {
      min: new Date().getFullYear(),
      max: new Date().getFullYear(),
    };
  }

  return {
    min: Math.min(...years),
    max: Math.max(...years),
  };
}

export function VehicleFilters({
  vehicles,
}: VehicleFiltersProps) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] =
    useState("");

  const [brand, setBrand] =
    useState("ALL");

  const [model, setModel] =
    useState("ALL");

  const [body, setBody] =
    useState("ALL");

  const [year, setYear] =
    useState("ALL");

  const [transmission, setTransmission] =
    useState("ALL");

  const [fuel, setFuel] =
    useState("ALL");

  const [status, setStatus] =
    useState("ALL");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [sort, setSort] =
    useState<SortOption>("newest");

  const brands = useMemo(() => {
    return Array.from(
      new Set(
        vehicles
          .map((vehicle) => vehicle.brand)
          .filter(Boolean)
      )
    ).sort();
  }, [vehicles]);

  const models = useMemo(() => {
    const source =
      brand === "ALL"
        ? vehicles
        : vehicles.filter(
            (vehicle) =>
              vehicle.brand === brand
          );

    return Array.from(
      new Set(
        source
          .map((vehicle) => vehicle.model)
          .filter(Boolean)
      )
    ).sort();
  }, [vehicles, brand]);

  const bodies = useMemo(() => {
    return Array.from(
      new Set(
        vehicles
          .map((vehicle) => vehicle.body)
          .filter(Boolean)
      )
    ).sort();
  }, [vehicles]);

  const transmissions = useMemo(() => {
    return Array.from(
      new Set(
        vehicles
          .map(
            (vehicle) =>
              vehicle.transmission
          )
          .filter(Boolean)
      )
    ).sort();
  }, [vehicles]);

  const fuels = useMemo(() => {
    return Array.from(
      new Set(
        vehicles
          .map((vehicle) => vehicle.fuel)
          .filter(Boolean)
      )
    ).sort();
  }, [vehicles]);

  const years = useMemo(() => {
    return Array.from(
      new Set(
        vehicles.map(
          (vehicle) => vehicle.year
        )
      )
    ).sort((a, b) => b - a);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    const minimumPrice =
      minPrice.trim() === ""
        ? null
        : Number(minPrice.replace(/[^\d.]/g, ""));

    const maximumPrice =
      maxPrice.trim() === ""
        ? null
        : Number(maxPrice.replace(/[^\d.]/g, ""));

    const result = vehicles.filter(
      (vehicle) => {
        /*
         * Search
         */
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

          if (
            !searchableText.includes(
              normalizedSearch
            )
          ) {
            return false;
          }
        }

        /*
         * Brand
         */
        if (
          brand !== "ALL" &&
          vehicle.brand !== brand
        ) {
          return false;
        }

        /*
         * Model
         */
        if (
          model !== "ALL" &&
          vehicle.model !== model
        ) {
          return false;
        }

        /*
         * Body
         */
        if (
          body !== "ALL" &&
          vehicle.body !== body
        ) {
          return false;
        }

        /*
         * Year
         */
        if (
          year !== "ALL" &&
          vehicle.year !== Number(year)
        ) {
          return false;
        }

        /*
         * Transmission
         */
        if (
          transmission !== "ALL" &&
          vehicle.transmission !==
            transmission
        ) {
          return false;
        }

        /*
         * Fuel
         */
        if (
          fuel !== "ALL" &&
          vehicle.fuel !== fuel
        ) {
          return false;
        }

        /*
         * Availability
         */
        if (
          status !== "ALL" &&
          vehicle.status !== status
        ) {
          return false;
        }

        /*
         * Price
         */
        const vehiclePrice =
          parsePrice(vehicle.price);

        if (
          minimumPrice !== null &&
          Number.isFinite(minimumPrice)
        ) {
          if (
            vehiclePrice === null ||
            vehiclePrice < minimumPrice
          ) {
            return false;
          }
        }

        if (
          maximumPrice !== null &&
          Number.isFinite(maximumPrice)
        ) {
          if (
            vehiclePrice === null ||
            vehiclePrice > maximumPrice
          ) {
            return false;
          }
        }

        return true;
      }
    );

    /*
     * Sorting
     */
    return [...result].sort(
      (a, b) => {
        switch (sort) {
          case "price-low": {
            const aPrice =
              parsePrice(a.price) ?? Infinity;

            const bPrice =
              parsePrice(b.price) ?? Infinity;

            return aPrice - bPrice;
          }

          case "price-high": {
            const aPrice =
              parsePrice(a.price) ?? -Infinity;

            const bPrice =
              parsePrice(b.price) ?? -Infinity;

            return bPrice - aPrice;
          }

          case "year-newest":
            return b.year - a.year;

          case "year-oldest":
            return a.year - b.year;

          case "oldest": {
            const aDate =
              a.createdAt
                ? new Date(
                    a.createdAt
                  ).getTime()
                : 0;

            const bDate =
              b.createdAt
                ? new Date(
                    b.createdAt
                  ).getTime()
                : 0;

            return aDate - bDate;
          }

          case "newest":
          default: {
            const aDate =
              a.createdAt
                ? new Date(
                    a.createdAt
                  ).getTime()
                : 0;

            const bDate =
              b.createdAt
                ? new Date(
                    b.createdAt
                  ).getTime()
                : 0;

            return bDate - aDate;
          }
        }
      }
    );
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

  const hasFilters =
    search.trim() !== "" ||
    brand !== "ALL" ||
    model !== "ALL" ||
    body !== "ALL" ||
    year !== "ALL" ||
    transmission !== "ALL" ||
    fuel !== "ALL" ||
    status !== "ALL" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sort !== "newest";

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

  function handleBrandChange(
    value: string
  ) {
    setBrand(value);

    /*
     * A model from the previous brand
     * should never remain selected.
     */
    setModel("ALL");
  }

  return (
    <>
      {/* =========================================================
          FILTER BAR
      ========================================================= */}

      <section className="border-y border-black/10 px-5 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex min-h-[66px] items-center justify-between gap-6">
            <button
              type="button"
              onClick={() =>
                setOpen(!open)
              }
              className="group flex items-center gap-3 text-[9px] font-medium uppercase tracking-[.2em] text-black/65 transition hover:text-black"
            >
              <SlidersHorizontal
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:rotate-90"
              />

              Find vehicles

              <span className="ml-1 flex h-5 min-w-5 items-center justify-center border border-black/10 px-1 text-[7px] text-black/40">
                {filteredVehicles.length}
              </span>
            </button>

            <div className="flex items-center gap-5">
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[8px] uppercase tracking-[.16em] text-black/40 transition hover:text-black"
                >
                  Reset
                </button>
              )}

              <span className="hidden text-[9px] uppercase tracking-[.18em] text-black/35 sm:block">
                {filteredVehicles.length}{" "}
                {filteredVehicles.length ===
                1
                  ? "vehicle"
                  : "vehicles"}
              </span>
            </div>
          </div>

          {/* =====================================================
              FILTER PANEL
          ===================================================== */}

          <div
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
              open
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="border-t border-black/10 py-8 md:py-10">
                {/* Search */}
                <div>
                  <label className="mb-3 block text-[8px] uppercase tracking-[.2em] text-black/35">
                    Search
                  </label>

                  <div className="relative">
                    <Search
                      size={15}
                      strokeWidth={1.3}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search make, model or keyword"
                      className="h-12 w-full border border-black/10 bg-white/40 pl-11 pr-10 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearch("")
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 transition hover:text-black"
                        aria-label="Clear search"
                      >
                        <X
                          size={14}
                          strokeWidth={1.4}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filters */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <FilterSelect
                    label="Make"
                    value={brand}
                    onChange={
                      handleBrandChange
                    }
                    options={brands}
                  />

                  <FilterSelect
                    label="Model"
                    value={model}
                    onChange={setModel}
                    options={models}
                    disabled={
                      brand !== "ALL" &&
                      models.length === 0
                    }
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
                    options={years.map(
                      String
                    )}
                  />

                  <FilterSelect
                    label="Transmission"
                    value={transmission}
                    onChange={
                      setTransmission
                    }
                    options={
                      transmissions
                    }
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
                    options={[
                      "AVAILABLE",
                      "RESERVED",
                      "SOLD",
                    ]}
                  />

                  <FilterSelect
                    label="Sort by"
                    value={sort}
                    onChange={(value) =>
                      setSort(
                        value as SortOption
                      )
                    }
                    options={[
                      "newest",
                      "oldest",
                      "price-low",
                      "price-high",
                      "year-newest",
                      "year-oldest",
                    ]}
                    displayLabels={{
                      newest:
                        "Newest first",
                      oldest:
                        "Oldest first",
                      "price-low":
                        "Price: low to high",
                      "price-high":
                        "Price: high to low",
                      "year-newest":
                        "Newest model year",
                      "year-oldest":
                        "Oldest model year",
                    }}
                  />
                </div>

                {/* Price */}
                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-[8px] uppercase tracking-[.2em] text-black/35">
                      Price range
                    </label>

                    <span className="text-[7px] uppercase tracking-[.15em] text-black/25">
                      NGN
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={minPrice}
                      onChange={(event) =>
                        setMinPrice(
                          event.target.value
                        )
                      }
                      placeholder="Minimum price"
                      className="h-12 border border-black/10 bg-white/40 px-4 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30"
                    />

                    <input
                      type="text"
                      inputMode="numeric"
                      value={maxPrice}
                      onChange={(event) =>
                        setMaxPrice(
                          event.target.value
                        )
                      }
                      placeholder="Maximum price"
                      className="h-12 border border-black/10 bg-white/40 px-4 text-sm outline-none transition placeholder:text-black/25 focus:border-black/30"
                    />
                  </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 flex flex-col gap-5 border-t border-black/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[9px] uppercase tracking-[.16em] text-black/35">
                    Showing{" "}
                    <span className="text-black">
                      {filteredVehicles.length}
                    </span>{" "}
                    of{" "}
                    <span className="text-black">
                      {vehicles.length}
                    </span>{" "}
                    vehicles
                  </p>

                  <div className="flex items-center gap-5">
                    {hasFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-[8px] font-medium uppercase tracking-[.17em] text-black/40 transition hover:text-black"
                      >
                        Reset filters
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setOpen(false)
                      }
                      className="inline-flex items-center gap-3 bg-[#090b0d] px-6 py-3 text-[9px] font-medium uppercase tracking-[.18em] text-white transition hover:opacity-85"
                    >
                      Show{" "}
                      {
                        filteredVehicles.length
                      }{" "}
                      vehicles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RESULTS
      ========================================================= */}

      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1600px]">
          {filteredVehicles.length > 0 ? (
            <div className="grid gap-x-7 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map(
                (vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                  />
                )
              )}
            </div>
          ) : (
            <NoResults
              hasFilters={hasFilters}
              onReset={resetFilters}
            />
          )}
        </div>
      </section>
    </>
  );
}

/* ===============================================================
   SELECT
=============================================================== */

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
  onChange: (
    value: string
  ) => void;
  options: string[];
  disabled?: boolean;
  displayLabels?: Record<
    string,
    string
  >;
}) {
  return (
    <div>
      <label className="mb-3 block text-[8px] uppercase tracking-[.2em] text-black/35">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="h-12 w-full appearance-none border border-black/10 bg-white/40 px-4 pr-10 text-[10px] uppercase tracking-[.08em] text-black/70 outline-none transition focus:border-black/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <option value="ALL">
            All {label.toLowerCase()}
          </option>

          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {displayLabels?.[option] ??
                option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          strokeWidth={1.3}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/30"
        />
      </div>
    </div>
  );
}

/* ===============================================================
   NO RESULTS
=============================================================== */

function NoResults({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset: () => void;
}) {
  return (
    <div className="border-y border-black/10 py-24 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center border border-black/10">
        <Search
          size={17}
          strokeWidth={1.2}
          className="text-black/30"
        />
      </div>

      <p className="mt-7 text-[9px] uppercase tracking-[.2em] text-black/40">
        No matching vehicles
      </p>

      <h2 className="mt-4 text-3xl font-medium tracking-[-.03em]">
        Nothing matched your search.
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/40">
        Try adjusting your filters or
        searching for another make or
        model.
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="mt-8 inline-flex items-center gap-3 border-b border-black/20 pb-1 text-[9px] font-medium uppercase tracking-[.18em] transition hover:border-black"
        >
          Clear all filters

          <ArrowDownUp
            size={12}
            strokeWidth={1.2}
          />
        </button>
      )}
    </div>
  );
}