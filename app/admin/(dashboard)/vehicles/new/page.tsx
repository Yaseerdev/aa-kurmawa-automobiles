"use client";

import {
  FormEvent,
  useCallback,
  useState,
} from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";


import {
  ImageUploader,
  uploadVehicleImages,
  type SelectedVehicleImage,
} from "@/components/admin/ImageUploader";

import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

const inputClass =
  "w-full border-b border-black/15 bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-black/20 focus:border-black";

const labelClass =
  "mb-2 block text-[9px] uppercase tracking-[0.2em] text-black/40";

export default function NewVehiclePage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createSupabaseBrowserClient();

  const [images, setImages] = useState<
    SelectedVehicleImage[]
  >([]);

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    currency: "NGN",
    mileage: "",
    transmission: "",
    fuel_type: "",
    body_type: "",
    engine: "",
    drivetrain: "",
    exterior_color: "",
    interior_color: "",
    condition: "",
    description: "",
    status: "AVAILABLE",
    featured: false,
    published: true,
  });

  const handleImagesChange = useCallback(
    (selectedImages: SelectedVehicleImage[]) => {
      setImages(selectedImages);
    },
    []
  );

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function createSlug() {
    return `${form.year}-${form.brand}-${form.model}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    const slug = createSlug();

    if (
      !form.brand.trim() ||
      !form.model.trim() ||
      !form.year
    ) {
      setError(
        "Please complete the required vehicle information."
      );
      setSaving(false);
      return;
    }

    const year = Number(form.year);

    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > 2100
    ) {
      setError("Please enter a valid vehicle year.");
      setSaving(false);
      return;
    }

    const price = form.price
      ? Number(form.price)
      : null;

    const mileage = form.mileage
      ? Number(form.mileage)
      : null;

    if (
      price !== null &&
      (!Number.isFinite(price) || price < 0)
    ) {
      setError("Please enter a valid price.");
      setSaving(false);
      return;
    }

    if (
      mileage !== null &&
      (!Number.isFinite(mileage) || mileage < 0)
    ) {
      setError("Please enter valid mileage.");
      setSaving(false);
      return;
    }

    /*
     * Create the vehicle first.
     * Supabase generates the vehicle ID for us.
     */
    const { data: vehicle, error: vehicleError } =
      await supabase
        .from("vehicles")
        .insert({
          slug,
          brand: form.brand.trim(),
          model: form.model.trim(),
          year,

          price,
          currency: form.currency,

          mileage,

          transmission:
            form.transmission || null,

          fuel_type:
            form.fuel_type || null,

          body_type:
            form.body_type || null,

          engine:
            form.engine.trim() || null,

          drivetrain:
            form.drivetrain.trim() || null,

          exterior_color:
            form.exterior_color.trim() || null,

          interior_color:
            form.interior_color.trim() || null,

          condition:
            form.condition || null,

          description:
            form.description.trim() || null,

          status: form.status,

          featured: form.featured,

          published: form.published,
        })
        .select("id")
        .single();

    if (vehicleError || !vehicle) {
        const errorMessage =
          vehicleError instanceof Error
            ? vehicleError.message
            : typeof vehicleError === "object" && vehicleError !== null
            ? JSON.stringify(vehicleError, Object.getOwnPropertyNames(vehicleError))
            : String(vehicleError);

        console.error(
          "========== VEHICLE CREATION FAILED =========="
        );

        console.error(
          "Message:",
          vehicleError?.message || "No message"
        );

        console.error(
          "Details:",
          vehicleError?.details || "No details"
        );

        console.error(
          "Hint:",
          vehicleError?.hint || "No hint"
        );

        console.error(
          "Code:",
          vehicleError?.code || "No code"
        );

        console.error(
          "Full error:",
          errorMessage
        );

        console.error(
          "=============================================="
        );

  if (vehicleError?.code === "23505") {
    setError(
      "A vehicle with this year, brand and model already exists."
    );
  } else {
    setError(
      vehicleError?.message ||
        "We couldn't create the vehicle. Please try again."
    );
  }

  setSaving(false);
  return;
}

    /*
     * Upload selected images after the vehicle exists.
     */
    if (images.length > 0) {
      const uploadResult =
        await uploadVehicleImages(
          vehicle.id,
          images
        );

      if (!uploadResult.success) {
        console.error(
          "Vehicle image upload failed:",
          uploadResult.error
        );

        /*
         * Remove the vehicle if image upload failed.
         * This prevents a vehicle from being created
         * without its requested images.
         */
        await supabase
          .from("vehicles")
          .delete()
          .eq("id", vehicle.id);

        setError(
          "The vehicle was not saved because its images could not be uploaded. Please try again."
        );

        setSaving(false);
        return;
      }
    }

    /*
     * Everything succeeded.
     */
    window.location.href =
      `/admin/vehicles/${vehicle.id}`;
  }

  return (
    <main className="min-h-screen bg-[#f4f2ed]">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="flex min-h-20 items-center justify-between gap-6 px-6 lg:px-10">
          <div className="flex items-center gap-5">
            <Link
              href="/admin/vehicles"
              className="flex h-9 w-9 items-center justify-center border border-black/10 transition-colors hover:bg-black hover:text-white"
              aria-label="Back to vehicles"
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.3}
              />
            </Link>

            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
                Inventory
              </p>

              <h1 className="mt-1 font-serif text-2xl tracking-[-0.025em]">
                Add vehicle
              </h1>
            </div>
          </div>

        <AdminSubmitButton
          form="vehicle-form"
          label="Save vehicle"
          pendingLabel="Saving..."
          pending={saving}
          className="bg-[#090b0d] px-5 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-white hover:opacity-85"
        />
        </div>
      </header>

      <form
        id="vehicle-form"
        onSubmit={handleSubmit}
        className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10 lg:py-14"
      >
        {/* Intro */}
        <div className="mb-12">
          <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
            New inventory
          </p>

          <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
            Add a vehicle.
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-black/45">
            Create a vehicle listing, add its specifications
            and upload the photography for the digital showroom.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 border border-red-900/10 bg-red-50 px-5 py-4">
            <p className="text-xs leading-5 text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* ==========================================
            01 — VEHICLE INFORMATION
        ========================================== */}
        <section>
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              01
            </p>

            <h3 className="mt-2 font-serif text-2xl">
              Vehicle information
            </h3>
          </div>

          <div className="grid gap-x-10 gap-y-7 border-t border-black/10 pt-7 md:grid-cols-2">
            <div>
              <label
                htmlFor="brand"
                className={labelClass}
              >
                Brand *
              </label>

              <input
                id="brand"
                value={form.brand}
                onChange={(event) =>
                  updateField(
                    "brand",
                    event.target.value
                  )
                }
                placeholder="e.g. Toyota"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="model"
                className={labelClass}
              >
                Model *
              </label>

              <input
                id="model"
                value={form.model}
                onChange={(event) =>
                  updateField(
                    "model",
                    event.target.value
                  )
                }
                placeholder="e.g. Land Cruiser 300"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className={labelClass}
              >
                Year *
              </label>

              <input
                id="year"
                type="number"
                min="1900"
                max="2100"
                value={form.year}
                onChange={(event) =>
                  updateField(
                    "year",
                    event.target.value
                  )
                }
                placeholder="2026"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className={labelClass}
              >
                Price
              </label>

              <input
                id="price"
                type="number"
                min="0"
                value={form.price}
                onChange={(event) =>
                  updateField(
                    "price",
                    event.target.value
                  )
                }
                placeholder="85000000"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="currency"
                className={labelClass}
              >
                Currency
              </label>

              <select
                id="currency"
                value={form.currency}
                onChange={(event) =>
                  updateField(
                    "currency",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="NGN">
                  NGN — Nigerian Naira
                </option>

                <option value="USD">
                  USD — US Dollar
                </option>

                <option value="GBP">
                  GBP — British Pound
                </option>

                <option value="EUR">
                  EUR — Euro
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="mileage"
                className={labelClass}
              >
                Mileage (km)
              </label>

              <input
                id="mileage"
                type="number"
                min="0"
                value={form.mileage}
                onChange={(event) =>
                  updateField(
                    "mileage",
                    event.target.value
                  )
                }
                placeholder="12400"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* ==========================================
            02 — SPECIFICATIONS
        ========================================== */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              02
            </p>

            <h3 className="mt-2 font-serif text-2xl">
              Specifications
            </h3>
          </div>

          <div className="grid gap-x-10 gap-y-7 border-t border-black/10 pt-7 md:grid-cols-2">
            <div>
              <label
                htmlFor="transmission"
                className={labelClass}
              >
                Transmission
              </label>

              <select
                id="transmission"
                value={form.transmission}
                onChange={(event) =>
                  updateField(
                    "transmission",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Select transmission
                </option>

                <option value="Automatic">
                  Automatic
                </option>

                <option value="Manual">
                  Manual
                </option>

                <option value="CVT">
                  CVT
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="fuel_type"
                className={labelClass}
              >
                Fuel type
              </label>

              <select
                id="fuel_type"
                value={form.fuel_type}
                onChange={(event) =>
                  updateField(
                    "fuel_type",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Select fuel
                </option>

                <option value="Petrol">
                  Petrol
                </option>

                <option value="Diesel">
                  Diesel
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="Electric">
                  Electric
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="body_type"
                className={labelClass}
              >
                Body type
              </label>

              <select
                id="body_type"
                value={form.body_type}
                onChange={(event) =>
                  updateField(
                    "body_type",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Select body type
                </option>

                <option value="SUV">
                  SUV
                </option>

                <option value="Sedan">
                  Sedan
                </option>

                <option value="Coupe">
                  Coupe
                </option>

                <option value="Convertible">
                  Convertible
                </option>

                <option value="Hatchback">
                  Hatchback
                </option>

                <option value="Pickup">
                  Pickup
                </option>

                <option value="Van">
                  Van
                </option>

                <option value="Wagon">
                  Wagon
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="engine"
                className={labelClass}
              >
                Engine
              </label>

              <input
                id="engine"
                value={form.engine}
                onChange={(event) =>
                  updateField(
                    "engine",
                    event.target.value
                  )
                }
                placeholder="3.5L Twin-Turbo V6"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="drivetrain"
                className={labelClass}
              >
                Drivetrain
              </label>

              <input
                id="drivetrain"
                value={form.drivetrain}
                onChange={(event) =>
                  updateField(
                    "drivetrain",
                    event.target.value
                  )
                }
                placeholder="4WD"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="condition"
                className={labelClass}
              >
                Condition
              </label>

              <select
                id="condition"
                value={form.condition}
                onChange={(event) =>
                  updateField(
                    "condition",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Select condition
                </option>

                <option value="Brand New">
                  Brand New
                </option>

                <option value="Foreign Used">
                  Foreign Used
                </option>

                <option value="Nigerian Used">
                  Nigerian Used
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="exterior_color"
                className={labelClass}
              >
                Exterior colour
              </label>

              <input
                id="exterior_color"
                value={form.exterior_color}
                onChange={(event) =>
                  updateField(
                    "exterior_color",
                    event.target.value
                  )
                }
                placeholder="Pearl White"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="interior_color"
                className={labelClass}
              >
                Interior colour
              </label>

              <input
                id="interior_color"
                value={form.interior_color}
                onChange={(event) =>
                  updateField(
                    "interior_color",
                    event.target.value
                  )
                }
                placeholder="Black"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* ==========================================
            03 — DESCRIPTION
        ========================================== */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              03
            </p>

            <h3 className="mt-2 font-serif text-2xl">
              Description
            </h3>
          </div>

          <div className="border-t border-black/10 pt-7">
            <label
              htmlFor="description"
              className={labelClass}
            >
              Vehicle description
            </label>

            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              rows={7}
              placeholder="Describe the vehicle, its condition, specification and notable details..."
              className="w-full resize-none border border-black/10 bg-white/20 p-4 text-sm leading-6 outline-none transition-colors placeholder:text-black/20 focus:border-black/30"
            />
          </div>
        </section>

        {/* ==========================================
            04 — PHOTOGRAPHY
        ========================================== */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              04
            </p>

            <h3 className="mt-2 font-serif text-2xl">
              Photography
            </h3>
          </div>

          <div className="border-t border-black/10 pt-7">
            <ImageUploader
              onImagesChange={
                handleImagesChange
              }
              maxImages={10}
            />
          </div>
        </section>

        {/* ==========================================
            05 — PUBLISHING
        ========================================== */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              05
            </p>

            <h3 className="mt-2 font-serif text-2xl">
              Publishing
            </h3>
          </div>

          <div className="grid gap-8 border-t border-black/10 pt-7 md:grid-cols-3">
            <div>
              <label
                htmlFor="status"
                className={labelClass}
              >
                Availability
              </label>

              <select
                id="status"
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="AVAILABLE">
                  Available
                </option>

                <option value="RESERVED">
                  Reserved
                </option>

                <option value="SOLD">
                  Sold
                </option>
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-4 border border-black/10 bg-white/20 p-4">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  updateField(
                    "featured",
                    event.target.checked
                  )
                }
                className="h-4 w-4 accent-black"
              />

              <span>
                <span className="block text-[10px] uppercase tracking-[0.16em]">
                  Featured
                </span>

                <span className="mt-1 block text-xs text-black/40">
                  Show prominently across the website.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-4 border border-black/10 bg-white/20 p-4">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) =>
                  updateField(
                    "published",
                    event.target.checked
                  )
                }
                className="h-4 w-4 accent-black"
              />

              <span>
                <span className="block text-[10px] uppercase tracking-[0.16em]">
                  Published
                </span>

                <span className="mt-1 block text-xs text-black/40">
                  Make this vehicle visible on the website.
                </span>
              </span>
            </label>
          </div>
        </section>

        {/* Bottom save */}
        <div className="mt-16 flex justify-end border-t border-black/10 pt-8">
          <AdminSubmitButton
            label="Save vehicle"
            pendingLabel="Saving vehicle..."
            pending={saving}
            className="bg-[#090b0d] px-7 py-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white hover:opacity-85"
          />
        </div>
      </form>
    </main>
  );
}