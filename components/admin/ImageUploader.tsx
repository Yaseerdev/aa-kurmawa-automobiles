"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  ImagePlus,
  Star,
  Trash2,
  GripVertical,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export type SelectedVehicleImage = {
  id: string;
  file: File;
  preview: string;
  isPrimary: boolean;
};

type ImageUploaderProps = {
  onImagesChange?: (images: SelectedVehicleImage[]) => void;
  maxImages?: number;
};

export function ImageUploader({
  onImagesChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [images, setImages] = useState<SelectedVehicleImage[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    onImagesChange?.(images);
  }, [images, onImagesChange]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [images]);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    setError("");

    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const remainingSlots = maxImages - images.length;

    if (remainingSlots <= 0) {
      setError(`You can upload a maximum of ${maxImages} images.`);
      event.target.value = "";
      return;
    }

    const acceptedFiles = files.slice(0, remainingSlots);

    const invalidFile = acceptedFiles.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setError("Please select image files only.");
      event.target.value = "";
      return;
    }

    const oversizedFile = acceptedFiles.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (oversizedFile) {
      setError("Each image must be smaller than 10MB.");
      event.target.value = "";
      return;
    }

    const newImages: SelectedVehicleImage[] = acceptedFiles.map(
      (file, index) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0 && index === 0,
      })
    );

    setImages((current) => [...current, ...newImages]);

    event.target.value = "";
  }

  function removeImage(id: string) {
    setImages((current) => {
      const imageToRemove = current.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      const remaining = current.filter((image) => image.id !== id);

      if (imageToRemove?.isPrimary && remaining.length > 0) {
        remaining[0] = {
          ...remaining[0],
          isPrimary: true,
        };
      }

      return remaining;
    });
  }

  function setPrimary(id: string) {
    setImages((current) =>
      current.map((image) => ({
        ...image,
        isPrimary: image.id === id,
      }))
    );
  }

  function moveImage(
    index: number,
    direction: "left" | "right"
  ) {
    setImages((current) => {
      const newImages = [...current];

      const targetIndex =
        direction === "left" ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= newImages.length
      ) {
        return current;
      }

      [newImages[index], newImages[targetIndex]] = [
        newImages[targetIndex],
        newImages[index],
      ];

      return newImages;
    });
  }

  return (
    <div>
      {/* Upload area */}
      <label
        htmlFor="vehicle-images"
        className="group flex cursor-pointer flex-col items-center justify-center border border-dashed border-black/15 bg-white/20 px-6 py-14 text-center transition-colors hover:border-black/35 hover:bg-white/40"
      >
        <div className="flex h-12 w-12 items-center justify-center border border-black/10 transition-colors group-hover:border-black/25">
          <ImagePlus
            size={19}
            strokeWidth={1.2}
            className="text-black/35"
          />
        </div>

        <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em]">
          Add vehicle images
        </p>

        <p className="mt-2 max-w-sm text-xs leading-5 text-black/40">
          Select high-quality photos of the vehicle. The first image will
          automatically become the primary image.
        </p>

        <span className="mt-5 border border-black/10 px-4 py-2 text-[8px] uppercase tracking-[0.18em] text-black/55 transition-colors group-hover:border-black group-hover:text-black">
          Choose files
        </span>

        <input
          id="vehicle-images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="sr-only"
        />
      </label>

      {/* Error */}
      {error && (
        <div className="mt-4 border border-red-900/10 bg-red-50 px-4 py-3">
          <p className="text-xs leading-5 text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Image count */}
      {images.length > 0 && (
        <div className="mt-6 flex items-center justify-between border-b border-black/10 pb-3">
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Selected images
          </p>

          <p className="text-[9px] uppercase tracking-[0.15em] text-black/35">
            {images.length} / {maxImages}
          </p>
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden border border-black/10 bg-black/[0.03]"
            >
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <img
                  src={image.preview}
                  alt={`Vehicle image ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />

                {/* Primary badge */}
                {image.isPrimary && (
                  <div className="absolute left-2 top-2 flex items-center gap-1.5 bg-white px-2 py-1">
                    <Star
                      size={10}
                      fill="currentColor"
                      strokeWidth={1.2}
                    />

                    <span className="text-[7px] font-medium uppercase tracking-[0.15em]">
                      Primary
                    </span>
                  </div>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <Trash2
                    size={12}
                    strokeWidth={1.3}
                  />
                </button>

                {/* Controls */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => moveImage(index, "left")}
                      disabled={index === 0}
                      className="flex h-7 w-7 items-center justify-center bg-black/70 text-white disabled:opacity-30"
                      aria-label="Move image left"
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      onClick={() => moveImage(index, "right")}
                      disabled={index === images.length - 1}
                      className="flex h-7 w-7 items-center justify-center bg-black/70 text-white disabled:opacity-30"
                      aria-label="Move image right"
                    >
                      →
                    </button>
                  </div>

                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(image.id)}
                      className="flex items-center gap-1.5 bg-white px-2.5 py-2 text-[7px] font-medium uppercase tracking-[0.12em] text-black"
                    >
                      <Star
                        size={9}
                        strokeWidth={1.2}
                      />
                      Make primary
                    </button>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 border-t border-black/10 px-3 py-2.5">
                <GripVertical
                  size={12}
                  strokeWidth={1.2}
                  className="text-black/20"
                />

                <span className="text-[8px] uppercase tracking-[0.14em] text-black/35">
                  Image {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hint */}
      <p className="mt-4 text-[8px] uppercase tracking-[0.14em] text-black/25">
        JPG, PNG, WEBP · Maximum 10MB per image
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Upload selected images to Supabase Storage
|--------------------------------------------------------------------------
|
| The vehicle must already exist in the database before calling this.
|
| Storage structure:
|
| vehicle-images/
|   {vehicleId}/
|     {unique-file-name}
|
*/

export async function uploadVehicleImages(
  vehicleId: string,
  images: SelectedVehicleImage[]
) {
  if (!images.length) {
    return {
      success: true,
      images: [],
    };
  }

  /*
   * IMPORTANT:
   * Always create the authenticated browser client here.
   *
   * Do NOT use the old generic client from "@/lib/supabase".
   * The Storage RLS policy requires:
   *
   * authenticated + is_staff()
   */
  const supabase = createSupabaseBrowserClient();

  const uploadedImages: {
    image_url: string;
    alt_text: string;
    sort_order: number;
    is_primary: boolean;
  }[] = [];

  try {
    /*
     * Confirm that the current browser session is authenticated.
     */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(
        `Authentication check failed: ${authError.message}`
      );
    }

    if (!user) {
      throw new Error(
        "You are not authenticated. Please log in again."
      );
    }

    console.log("Image upload authenticated as:", user.id);

    /*
     * Upload files one by one.
     */
    for (let index = 0; index < images.length; index++) {
      const image = images[index];

      if (!image) {
        continue;
      }

      const fileExtension =
        image.file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const filePath = `${vehicleId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(filePath, image.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: image.file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("vehicle-images")
        .getPublicUrl(filePath);

      uploadedImages.push({
        image_url: publicUrl,
        alt_text: `AA Kurmawa ${index + 1}`,
        sort_order: index,
        is_primary: image.isPrimary,
      });
    }

    /*
     * Save image records in vehicle_images.
     */
    const { error: databaseError } = await supabase
      .from("vehicle_images")
      .insert(
        uploadedImages.map((image) => ({
          vehicle_id: vehicleId,
          image_url: image.image_url,
          alt_text: image.alt_text,
          sort_order: image.sort_order,
          is_primary: image.is_primary,
        }))
      );

    if (databaseError) {
      throw databaseError;
    }

    return {
      success: true,
      images: uploadedImages,
    };
  } catch (error) {
    console.error("Vehicle image upload failed:", error);

    return {
      success: false,
      images: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload vehicle images.",
    };
  }
}