"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Trash2,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  ImageUploader,
  uploadVehicleImages,
  type SelectedVehicleImage,
} from "@/components/admin/ImageUploader";

import {
  VehicleImageManager,
  type ManagedVehicleImage,
} from "@/components/admin/VehicleImageManager";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

type Vehicle = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number | null;
  currency: string;
  mileage: number | null;
  transmission: string | null;
  fuel_type: string | null;
  body_type: string | null;
  engine: string | null;
  drivetrain: string | null;
  exterior_color: string | null;
  interior_color: string | null;
  condition: string | null;
  description: string | null;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  featured: boolean;
  published: boolean;
};

type VehicleImage = ManagedVehicleImage;

const inputClass =
  "w-full border-b border-black/15 bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-black/20 focus:border-black";

const labelClass =
  "mb-2 block text-[9px] uppercase tracking-[0.2em] text-black/40";

export default function VehicleEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createSupabaseBrowserClient();

  const [vehicleId, setVehicleId] = useState("");

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [existingImages, setExistingImages] =
    useState<VehicleImage[]>([]);

  const [newImages, setNewImages] = useState<
    SelectedVehicleImage[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function getId() {
      const resolvedParams = await params;
      setVehicleId(resolvedParams.id);
    }

    getId();
  }, [params]);

  useEffect(() => {
    if (!vehicleId) return;

    async function loadVehicle() {
      setLoading(true);
      setError("");

      const { data, error: vehicleError } =
        await supabase
          .from("vehicles")
          .select("*")
          .eq("id", vehicleId)
          .single();

      if (vehicleError || !data) {
        console.error(vehicleError);
        setError("Vehicle could not be found.");
        setLoading(false);
        return;
      }

      const { data: images, error: imagesError } =
        await supabase
          .from("vehicle_images")
          .select("*")
          .eq("vehicle_id", vehicleId)
          .order("sort_order", {
            ascending: true,
          });

      if (imagesError) {
        console.error(imagesError);
        setError(
          "Vehicle loaded, but its images could not be loaded."
        );
      }

      setVehicle(data);
      setExistingImages(images ?? []);
      setLoading(false);
    }

    loadVehicle();
  }, [vehicleId]);

  const handleNewImagesChange = useCallback(
    (images: SelectedVehicleImage[]) => {
      setNewImages(images);
    },
    []
  );

  function updateField(
    field: keyof Vehicle,
    value: string | number | boolean | null
  ) {
    setVehicle((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current
    );
  }

  async function saveVehicle(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!vehicle) return;

    setSaving(true);
    setError("");
    setMessage("");

    const { error: updateError } =
      await supabase
        .from("vehicles")
        .update({
          brand: vehicle.brand.trim(),
          model: vehicle.model.trim(),
          year: vehicle.year,
          price: vehicle.price,
          currency: vehicle.currency,
          mileage: vehicle.mileage,
          transmission:
            vehicle.transmission || null,
          fuel_type: vehicle.fuel_type || null,
          body_type: vehicle.body_type || null,
          engine: vehicle.engine || null,
          drivetrain: vehicle.drivetrain || null,
          exterior_color:
            vehicle.exterior_color || null,
          interior_color:
            vehicle.interior_color || null,
          condition: vehicle.condition || null,
          description:
            vehicle.description || null,
          status: vehicle.status,
          featured: vehicle.featured,
          published: vehicle.published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", vehicle.id);

    if (updateError) {
        console.error(
          "Vehicle update failed:",
          updateError
        );

        setError(
          updateError.message ||
            updateError.details ||
            updateError.hint ||
            "The vehicle details could not be saved."
        );

        setSaving(false);
        return;
      }

    /*
     * Upload any newly selected images.
     */
    if (newImages.length > 0) {
      const uploadResult =
        await uploadVehicleImages(
          vehicle.id,
          newImages
        );

      if (!uploadResult.success) {
        setError(
          uploadResult.error ||
            "Vehicle saved, but the new images could not be uploaded."
        );
        setSaving(false);
        return;
      }

      /*
       * Reload images after successful upload.
       */
      const { data: refreshedImages } =
        await supabase
          .from("vehicle_images")
          .select("*")
          .eq("vehicle_id", vehicle.id)
          .order("sort_order", {
            ascending: true,
          });

      setExistingImages(refreshedImages ?? []);
      setNewImages([]);
    }

    setMessage("Vehicle saved successfully.");
    setSaving(false);
  }

  async function deleteImage(image: VehicleImage) {
    const confirmed = window.confirm(
      "Remove this image from the vehicle?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    /*
     * Extract the Storage path from the public URL.
     */
    const marker =
      "/storage/v1/object/public/vehicle-images/";

    const markerIndex =
      image.image_url.indexOf(marker);

    if (markerIndex !== -1) {
      const storagePath =
        image.image_url.substring(
          markerIndex + marker.length
        );

      const { error: storageError } =
        await supabase.storage
          .from("vehicle-images")
          .remove([storagePath]);

      if (storageError) {
        console.error(storageError);
      }
    }

    const { error: databaseError } =
      await supabase
        .from("vehicle_images")
        .delete()
        .eq("id", image.id);

    if (databaseError) {
      console.error(databaseError);
      setError(
        "The image could not be removed."
      );
      return;
    }

    setExistingImages((current) =>
      current.filter(
        (currentImage) =>
          currentImage.id !== image.id
      )
    );

    setMessage("Image removed.");
  }

  async function setPrimaryImage(
    image: VehicleImage
  ) {
    if (!vehicle) return;

    setError("");
    setMessage("");

    /*
     * Remove primary status from every image.
     */
    const { error: resetError } =
      await supabase
        .from("vehicle_images")
        .update({
          is_primary: false,
        })
        .eq("vehicle_id", vehicle.id);

    if (resetError) {
      console.error(resetError);
      setError(
        "Could not update the primary image."
      );
      return;
    }

    /*
     * Make selected image primary.
     */
    const { error: primaryError } =
      await supabase
        .from("vehicle_images")
        .update({
          is_primary: true,
        })
        .eq("id", image.id);

    if (primaryError) {
      console.error(primaryError);
      setError(
        "Could not update the primary image."
      );
      return;
    }

    setExistingImages((current) =>
      current.map((currentImage) => ({
        ...currentImage,
        is_primary:
          currentImage.id === image.id,
      }))
    );

    setMessage("Primary image updated.");
  }

  async function deleteVehicle() {
    if (!vehicle) return;

    const confirmed = window.confirm(
      `Delete ${vehicle.brand} ${vehicle.model}? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    /*
     * Get all image records first so we can
     * remove their Storage files.
     */
    const { data: images } =
      await supabase
        .from("vehicle_images")
        .select("image_url")
        .eq("vehicle_id", vehicle.id);

    if (images && images.length > 0) {
      const marker =
        "/storage/v1/object/public/vehicle-images/";

      const paths = images
        .map((image) => {
          const index =
            image.image_url.indexOf(marker);

          if (index === -1) return null;

          return image.image_url.substring(
            index + marker.length
          );
        })
        .filter(
          (path): path is string => Boolean(path)
        );

      if (paths.length > 0) {
        await supabase.storage
          .from("vehicle-images")
          .remove(paths);
      }
    }

    /*
     * vehicle_images is configured with
     * ON DELETE CASCADE, so its database
     * records will be removed automatically.
     */
    const { error: deleteError } =
      await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicle.id);

    if (deleteError) {
      console.error(deleteError);
      setError(
        "The vehicle could not be deleted."
      );
      setDeleting(false);
      return;
    }

    window.location.href =
      "/admin/vehicles";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f2ed]">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
            Loading vehicle...
          </p>
        </div>
      </main>
    );
  }

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-[#f4f2ed]">
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <p className="text-[9px] uppercase tracking-[0.25em] text-black/35">
            Inventory
          </p>

          <h1 className="mt-3 font-serif text-4xl">
            Vehicle not found.
          </h1>

          <p className="mt-3 text-sm text-black/45">
            {error ||
              "This vehicle may have been removed."}
          </p>

          <Link
            href="/admin/vehicles"
            className="mt-8 bg-[#090b0d] px-6 py-3 text-[9px] uppercase tracking-[0.2em] text-white"
          >
            Back to inventory
          </Link>
        </div>
      </main>
    );
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
                {vehicle.brand} {vehicle.model}
              </h1>
            </div>
          </div>

        <AdminSubmitButton
            form="vehicle-editor"
            label="Save vehicle"
            pendingLabel="Saving..."
            pending={saving}
            className="bg-[#090b0d] px-5 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-white hover:opacity-85"
          /> 
         
        </div>
      </header>

      <form
        id="vehicle-editor"
        onSubmit={saveVehicle}
        className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10 lg:py-14"
      >
        {/* Status */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border border-black/10 bg-white/20 px-5 py-4">
          <div>
            <p className="text-[8px] uppercase tracking-[0.2em] text-black/35">
              Current status
            </p>

            <p className="mt-1 text-sm">
              {vehicle.status === "AVAILABLE"
                ? "Available"
                : vehicle.status === "RESERVED"
                  ? "Reserved"
                  : "Sold"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                vehicle.status === "AVAILABLE"
                  ? "bg-green-600"
                  : vehicle.status === "RESERVED"
                    ? "bg-yellow-500"
                    : "bg-black/30"
              }`}
            />

            <span className="text-[8px] uppercase tracking-[0.15em] text-black/45">
              {vehicle.published
                ? "Published"
                : "Unpublished"}
            </span>
          </div>
        </div>

        {/* ==========================================
            01 — VEHICLE INFORMATION
        ========================================== */}
        <section>
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              01
            </p>

            <h2 className="mt-2 font-serif text-2xl">
              Vehicle information
            </h2>
          </div>

          <div className="grid gap-x-10 gap-y-7 border-t border-black/10 pt-7 md:grid-cols-2">
            <div>
              <label
                htmlFor="brand"
                className={labelClass}
              >
                Brand
              </label>

              <input
                id="brand"
                value={vehicle.brand}
                onChange={(event) =>
                  updateField(
                    "brand",
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="model"
                className={labelClass}
              >
                Model
              </label>

              <input
                id="model"
                value={vehicle.model}
                onChange={(event) =>
                  updateField(
                    "model",
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className={labelClass}
              >
                Year
              </label>

              <input
                id="year"
                type="number"
                value={vehicle.year}
                onChange={(event) =>
                  updateField(
                    "year",
                    Number(event.target.value)
                  )
                }
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
                value={vehicle.price ?? ""}
                onChange={(event) =>
                  updateField(
                    "price",
                    event.target.value
                      ? Number(event.target.value)
                      : null
                  )
                }
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
                value={vehicle.currency}
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
                value={vehicle.mileage ?? ""}
                onChange={(event) =>
                  updateField(
                    "mileage",
                    event.target.value
                      ? Number(event.target.value)
                      : null
                  )
                }
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

            <h2 className="mt-2 font-serif text-2xl">
              Specifications
            </h2>
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
                value={vehicle.transmission ?? ""}
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
                value={vehicle.fuel_type ?? ""}
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
                value={vehicle.body_type ?? ""}
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
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">
                  Convertible
                </option>
                <option value="Hatchback">
                  Hatchback
                </option>
                <option value="Pickup">
                  Pickup
                </option>
                <option value="Van">Van</option>
                <option value="Wagon">Wagon</option>
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
                value={vehicle.engine ?? ""}
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
                value={vehicle.drivetrain ?? ""}
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
                value={vehicle.condition ?? ""}
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
                value={vehicle.exterior_color ?? ""}
                onChange={(event) =>
                  updateField(
                    "exterior_color",
                    event.target.value
                  )
                }
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
                value={vehicle.interior_color ?? ""}
                onChange={(event) =>
                  updateField(
                    "interior_color",
                    event.target.value
                  )
                }
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

            <h2 className="mt-2 font-serif text-2xl">
              Description
            </h2>
          </div>

          <div className="border-t border-black/10 pt-7">
            <textarea
              value={vehicle.description ?? ""}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              rows={7}
              placeholder="Describe this vehicle..."
              className="w-full resize-none border border-black/10 bg-white/20 p-4 text-sm leading-6 outline-none focus:border-black/30"
            />
          </div>
        </section>

       
           {/* ==========================================
    04 — CURRENT PHOTOGRAPHY
========================================== */}
<section className="mt-16">
  <div className="mb-6 flex items-end justify-between gap-5">
    <div>
      <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
        04
      </p>

      <h2 className="mt-2 font-serif text-2xl">
        Photography
      </h2>
    </div>

    <span className="text-[9px] uppercase tracking-[0.16em] text-black/35">
      {existingImages.length}{" "}
      {existingImages.length === 1
        ? "image"
        : "images"}
    </span>
  </div>

  <div className="border-t border-black/10 pt-7">
    <VehicleImageManager
      vehicleId={vehicle.id}
      images={existingImages}
      onImagesChange={(images) =>
        setExistingImages(
          images as VehicleImage[]
        )
      }
    />
  </div>
</section>

        {/* ==========================================
            05 — ADD MORE PHOTOS
        ========================================== */}
        <section className="mt-12">
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              05
            </p>

            <h2 className="mt-2 font-serif text-2xl">
              Add more photos
            </h2>
          </div>

          <div className="border-t border-black/10 pt-7">
            <ImageUploader
              onImagesChange={
                handleNewImagesChange
              }
              maxImages={10}
            />
          </div>
        </section>

        {/* ==========================================
            06 — PUBLISHING
        ========================================== */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              06
            </p>

            <h2 className="mt-2 font-serif text-2xl">
              Publishing
            </h2>
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
                value={vehicle.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as Vehicle["status"]
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
                checked={vehicle.featured}
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
                checked={vehicle.published}
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

        {/* Feedback */}
        {(message || error) && (
          <div
            className={`mt-10 border px-5 py-4 ${
              error
                ? "border-red-900/10 bg-red-50"
                : "border-black/10 bg-white/30"
            }`}
          >
            <p
              className={`text-xs ${
                error
                  ? "text-red-700"
                  : "text-black/60"
              }`}
            >
              {error || message}
            </p>
          </div>
        )}

        {/* Bottom actions */}
        <div className="mt-16 flex flex-col-reverse items-stretch justify-between gap-5 border-t border-black/10 pt-8 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={deleteVehicle}
            disabled={deleting}
            className="flex items-center justify-center gap-2 px-2 py-3 text-[8px] uppercase tracking-[0.16em] text-red-700 transition-opacity hover:opacity-60 disabled:opacity-40 sm:justify-start"
          >
            <Trash2
              size={13}
              strokeWidth={1.3}
            />

            {deleting
              ? "Deleting..."
              : "Delete vehicle"}
          </button>
          
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