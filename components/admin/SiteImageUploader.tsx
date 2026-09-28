"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  ImagePlus,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type SiteImageUploaderProps = {
  label: string;
  description: string;
  fieldName: string;
  initialUrl: string;
  filePrefix: string;
  aspectClass?: string;
};

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function SiteImageUploader({
  label,
  description,
  fieldName,
  initialUrl,
  filePrefix,
  aspectClass = "aspect-[16/9]",
}: SiteImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setUploaded(false);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(
        "Please choose a JPG, PNG or WebP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 8MB.");

      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const supabase =
        createSupabaseBrowserClient();

      const extension =
        file.name.split(".").pop()?.toLowerCase() ||
        "jpg";

      const fileName = `${filePrefix}-${Date.now()}.${extension}`;

      const filePath = `homepage/${fileName}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("vehicle-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error(
          "Site image upload failed:",
          uploadError
        );

        throw new Error(
          uploadError.message ||
            "Upload failed."
        );
      }

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("vehicle-images")
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) {
        throw new Error(
          "Could not create the image URL."
        );
      }

      setImageUrl(
        publicUrlData.publicUrl
      );

      setUploaded(true);
    } catch (uploadError) {
      console.error(
        "Site image upload error:",
        uploadError
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Something went wrong while uploading the image."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function clearImage() {
    setImageUrl("");
    setUploaded(false);
    setError("");
  }

  return (
    <div className="md:col-span-2 border-t border-black/10">
      <div className="p-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="text-[8px] uppercase tracking-[0.2em] text-black/40">
              {label}
            </p>

            <p className="mt-2 max-w-xl text-xs leading-5 text-black/45">
              {description}
            </p>
          </div>

          {uploaded && (
            <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-black/50">
              <Check
                size={12}
                strokeWidth={1.5}
              />

              Uploaded
            </div>
          )}
        </div>

        {imageUrl ? (
          <div className="relative mt-6 overflow-hidden bg-[#deddd8]">
            <div
              className={`relative ${aspectClass}`}
            >
              <Image
                src={imageUrl}
                alt={`${label} preview`}
                fill
                unoptimized
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <p className="max-w-[70%] truncate text-[8px] uppercase tracking-[0.16em] text-white/70">
                  Current image
                </p>

                <button
                  type="button"
                  onClick={clearImage}
                  disabled={uploading}
                  className="flex h-9 w-9 items-center justify-center border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${label}`}
                >
                  <X
                    size={14}
                    strokeWidth={1.4}
                  />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`mt-6 flex ${aspectClass} items-center justify-center border border-dashed border-black/15 bg-black/[0.015]`}
          >
            <div className="text-center">
              <ImagePlus
                size={28}
                strokeWidth={1}
                className="mx-auto text-black/25"
              />

              <p className="mt-4 text-[8px] uppercase tracking-[0.2em] text-black/35">
                No image selected
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            disabled={uploading}
            className="inline-flex items-center justify-center gap-3 bg-[#090b0d] px-6 py-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2
                  size={13}
                  strokeWidth={1.4}
                  className="animate-spin"
                />

                Uploading...
              </>
            ) : (
              <>
                <Upload
                  size={13}
                  strokeWidth={1.4}
                />

                Choose from gallery
              </>
            )}
          </button>

          {imageUrl && (
            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              disabled={uploading}
              className="inline-flex items-center justify-center gap-3 border border-black/15 px-6 py-4 text-[9px] font-medium uppercase tracking-[0.2em] text-black/60 transition hover:border-black/35 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ImagePlus
                size={13}
                strokeWidth={1.4}
              />

              Replace image
            </button>
          )}
        </div>

        <div className="mt-6">
          <label
            htmlFor={`${fieldName}_url`}
            className="text-[8px] uppercase tracking-[0.2em] text-black/35"
          >
            Or use an image URL
          </label>

          <input
            id={`${fieldName}_url`}
            name={fieldName}
            type="url"
            value={imageUrl}
            onChange={(event) => {
              setImageUrl(event.target.value);
              setUploaded(false);
              setError("");
            }}
            placeholder="https://..."
            className="mt-4 w-full border-b border-black/15 bg-transparent pb-3 text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/45"
          />
        </div>

        {error && (
          <p className="mt-4 text-[9px] leading-5 text-red-700/70">
            {error}
          </p>
        )}

        <p className="mt-5 text-[8px] leading-5 text-black/30">
          JPG, PNG or WebP · Maximum 8MB ·
          High-resolution landscape images are recommended.
        </p>
      </div>
    </div>
  );
}