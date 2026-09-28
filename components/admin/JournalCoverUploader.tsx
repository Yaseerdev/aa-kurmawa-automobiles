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

type JournalCoverUploaderProps = {
  initialUrl?: string | null;
};

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function JournalCoverUploader({
  initialUrl = "",
}: JournalCoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 8MB.");
      return;
    }

    try {
      setUploading(true);

      const supabase = createSupabaseBrowserClient();

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath = `journal/cover-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("vehicle-images")
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (uploadError) {
      console.error("Failed to upload journal cover:", uploadError);

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload image."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeImage() {
    setImageUrl("");
    setError("");
  }

  return (
    <div>
      <input
        type="hidden"
        name="cover_image"
        value={imageUrl}
      />

      <div className="flex items-center justify-between">
        <div>
          <label className="block text-[8px] uppercase tracking-[0.2em] text-black/40">
            Cover image
          </label>

          <p className="mt-2 text-[10px] leading-5 text-black/35">
            Use a strong editorial image. JPG, PNG or WebP up to 8MB.
          </p>
        </div>

        {imageUrl && (
          <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.18em] text-black/45">
            <Check size={12} strokeWidth={1.4} />
            Image ready
          </span>
        )}
      </div>

      <div className="mt-5 overflow-hidden border border-black/10 bg-white/20">
        {imageUrl ? (
          <div className="relative aspect-[16/9]">
            <Image
              src={imageUrl}
              alt="Journal cover preview"
              fill
              unoptimized
              className="object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/55 px-4 py-3 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-70 disabled:opacity-40"
              >
                <Upload size={13} strokeWidth={1.3} />
                Replace
              </button>

              <button
                type="button"
                onClick={removeImage}
                disabled={uploading}
                className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white disabled:opacity-40"
              >
                <X size={13} strokeWidth={1.3} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-4 text-black/35 transition-colors hover:bg-black/[0.025] hover:text-black/60 disabled:cursor-wait disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2
                  size={22}
                  strokeWidth={1.2}
                  className="animate-spin"
                />

                <span className="text-[8px] uppercase tracking-[0.22em]">
                  Uploading image...
                </span>
              </>
            ) : (
              <>
                <span className="flex h-12 w-12 items-center justify-center border border-black/10">
                  <ImagePlus
                    size={19}
                    strokeWidth={1.2}
                  />
                </span>

                <span className="text-[8px] uppercase tracking-[0.22em]">
                  Upload cover image
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        className="hidden"
      />

      {error && (
        <p className="mt-3 text-[10px] leading-5 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}