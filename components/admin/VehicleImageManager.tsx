"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  GripVertical,
  Loader2,
  Trash2,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export type ManagedVehicleImage = {
  id: string;
  vehicle_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

type VehicleImageManagerProps = {
  vehicleId: string;
  images: ManagedVehicleImage[];
  onImagesChange: (
    images: ManagedVehicleImage[]
  ) => void;
};

export function VehicleImageManager({
  vehicleId,
  images,
  onImagesChange,
}: VehicleImageManagerProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(
    null
  );
  const [dragOverId, setDragOverId] = useState<string | null>(
    null
  );

  const supabase = createSupabaseBrowserClient();

  /*
   * Save the complete image order to Supabase.
   */
  async function saveOrder(
    reorderedImages: ManagedVehicleImage[]
  ) {
    setMessage("");

    for (
      let index = 0;
      index < reorderedImages.length;
      index++
    ) {
      const image = reorderedImages[index];

      if (!image) continue;

      const { error } = await supabase
        .from("vehicle_images")
        .update({
          sort_order: index,
        })
        .eq("id", image.id)
        .eq("vehicle_id", vehicleId);

      if (error) {
        console.error(
          "Image order update failed:",
          error
        );

        setMessage(
          error.message ||
            "Could not save image order."
        );

        return false;
      }
    }

    return true;
  }

  /*
   * Normalize the local image array.
   */
  function normalizeImages(
    imageList: ManagedVehicleImage[]
  ) {
    return imageList.map(
      (image, index) => ({
        ...image,
        sort_order: index,
      })
    );
  }

  /*
   * Move an image to a specific position.
   */
  async function moveImageToIndex(
    imageId: string,
    targetIndex: number
  ) {
    const currentIndex = images.findIndex(
      (image) => image.id === imageId
    );

    if (currentIndex === -1) return;

    if (
      targetIndex < 0 ||
      targetIndex >= images.length ||
      targetIndex === currentIndex
    ) {
      return;
    }

    setBusyId(imageId);
    setMessage("");

    const reordered = [...images];

    const [movedImage] = reordered.splice(
      currentIndex,
      1
    );

    if (!movedImage) {
      setBusyId(null);
      return;
    }

    reordered.splice(
      targetIndex,
      0,
      movedImage
    );

    const normalized =
      normalizeImages(reordered);

    const success =
      await saveOrder(normalized);

    if (success) {
      onImagesChange(normalized);
      setMessage("Image order saved.");
    }

    setBusyId(null);
  }

  /*
   * Detect the number of columns currently
   * visible in the image grid.
   */
  function getGridColumns() {
    if (typeof window === "undefined") {
      return 4;
    }

    const width = window.innerWidth;

    if (width >= 1024) {
      return 4;
    }

    if (width >= 640) {
      return 3;
    }

    return 2;
  }

  /*
   * Move an image in a specific direction.
   */
  async function moveImage(
    imageId: string,
    direction:
      | "up"
      | "down"
      | "left"
      | "right"
  ) {
    const currentIndex =
      images.findIndex(
        (image) => image.id === imageId
      );

    if (currentIndex === -1) return;

    const columns = getGridColumns();

    let targetIndex = currentIndex;

    switch (direction) {
      case "left":
        targetIndex = currentIndex - 1;
        break;

      case "right":
        targetIndex = currentIndex + 1;
        break;

      case "up":
        targetIndex =
          currentIndex - columns;
        break;

      case "down":
        targetIndex =
          currentIndex + columns;
        break;
    }

    /*
     * Prevent moving across rows with
     * left/right controls.
     *
     * Example:
     *
     * 1  2  3  4
     * 5  6  7  8
     *
     * Right from 4 should NOT jump to 5.
     */
    if (direction === "right") {
      const currentColumn =
        currentIndex % columns;

      if (
        currentColumn ===
        columns - 1
      ) {
        return;
      }
    }

    if (direction === "left") {
      const currentColumn =
        currentIndex % columns;

      if (currentColumn === 0) {
        return;
      }
    }

    if (
      targetIndex < 0 ||
      targetIndex >= images.length
    ) {
      return;
    }

    await moveImageToIndex(
      imageId,
      targetIndex
    );
  }

  /*
   * Drag & drop support.
   */
  function handleDragStart(
    event: React.DragEvent<HTMLDivElement>,
    imageId: string
  ) {
    setDraggedId(imageId);
    setDragOverId(null);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      imageId
    );
  }

  function handleDragOver(
    event: React.DragEvent<HTMLDivElement>,
    imageId: string
  ) {
    event.preventDefault();

    if (
      draggedId &&
      draggedId !== imageId
    ) {
      event.dataTransfer.dropEffect =
        "move";

      setDragOverId(imageId);
    }
  }

  function handleDragLeave(
    imageId: string
  ) {
    if (dragOverId === imageId) {
      setDragOverId(null);
    }
  }

  async function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    targetImageId: string
  ) {
    event.preventDefault();

    const sourceImageId =
      event.dataTransfer.getData(
        "text/plain"
      ) || draggedId;

    setDragOverId(null);
    setDraggedId(null);

    if (
      !sourceImageId ||
      sourceImageId === targetImageId
    ) {
      return;
    }

    const sourceIndex =
      images.findIndex(
        (image) =>
          image.id === sourceImageId
      );

    const targetIndex =
      images.findIndex(
        (image) =>
          image.id === targetImageId
      );

    if (
      sourceIndex === -1 ||
      targetIndex === -1
    ) {
      return;
    }

    setBusyId(sourceImageId);
    setMessage("");

    const reordered = [...images];

    const [movedImage] =
      reordered.splice(
        sourceIndex,
        1
      );

    if (!movedImage) {
      setBusyId(null);
      return;
    }

    /*
     * Insert directly at the target position.
     */
    reordered.splice(
      targetIndex,
      0,
      movedImage
    );

    const normalized =
      normalizeImages(reordered);

    const success =
      await saveOrder(normalized);

    if (success) {
      onImagesChange(normalized);
      setMessage("Image order saved.");
    }

    setBusyId(null);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  /*
   * Make an image primary.
   */
  async function makePrimary(
    imageId: string
  ) {
    setBusyId(imageId);
    setMessage("");

    /*
     * Confirm the admin session exists.
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "Authenticated user check failed:",
        userError
      );

      setMessage(
        "Your admin session has expired. Please log in again."
      );

      setBusyId(null);
      return;
    }

    /*
     * Remove primary status from all images.
     */
    const { error: resetError } =
      await supabase
        .from("vehicle_images")
        .update({
          is_primary: false,
        })
        .eq("vehicle_id", vehicleId);

    if (resetError) {
      console.error(
        "Primary reset failed:",
        resetError
      );

      setMessage(
        resetError.message ||
          "Could not update the primary image."
      );

      setBusyId(null);
      return;
    }

    /*
     * Set selected image as primary.
     */
    const { error: primaryError } =
      await supabase
        .from("vehicle_images")
        .update({
          is_primary: true,
        })
        .eq("id", imageId)
        .eq("vehicle_id", vehicleId);

    if (primaryError) {
      console.error(
        "Primary image update failed:",
        primaryError
      );

      setMessage(
        primaryError.message ||
          "Could not update the primary image."
      );

      setBusyId(null);
      return;
    }

    const updatedImages =
      images.map((image) => ({
        ...image,
        is_primary:
          image.id === imageId,
      }));

    onImagesChange(updatedImages);

    setMessage("Primary image updated.");
    setBusyId(null);
  }

  /*
   * Delete an image.
   */
  async function deleteImage(
    image: ManagedVehicleImage
  ) {
    const confirmed = window.confirm(
      "Remove this image from the vehicle?"
    );

    if (!confirmed) return;

    setBusyId(image.id);
    setMessage("");

    /*
     * Remove the physical file from
     * Supabase Storage.
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
        console.error(
          "Storage image deletion failed:",
          storageError
        );
      }
    }

    /*
     * Remove the database record.
     */
    const { error: databaseError } =
      await supabase
        .from("vehicle_images")
        .delete()
        .eq("id", image.id)
        .eq("vehicle_id", vehicleId);

    if (databaseError) {
      console.error(
        "Database image deletion failed:",
        databaseError
      );

      setMessage(
        databaseError.message ||
          "Could not remove image."
      );

      setBusyId(null);
      return;
    }

    let remaining =
      images.filter(
        (currentImage) =>
          currentImage.id !== image.id
      );

    /*
     * If the deleted image was primary,
     * promote the first remaining image.
     */
    if (
      image.is_primary &&
      remaining.length > 0
    ) {
      const newPrimary =
        remaining[0];

      if (newPrimary) {
        const {
          error: primaryError,
        } = await supabase
          .from("vehicle_images")
          .update({
            is_primary: true,
          })
          .eq("id", newPrimary.id)
          .eq("vehicle_id", vehicleId);

        if (primaryError) {
          console.error(
            "Automatic primary update failed:",
            primaryError
          );
        }

        remaining =
          remaining.map(
            (currentImage) => ({
              ...currentImage,
              is_primary:
                currentImage.id ===
                newPrimary.id,
            })
          );
      }
    }

    /*
     * Normalize the remaining order.
     */
    const normalized =
      normalizeImages(remaining);

    const orderSaved =
      await saveOrder(normalized);

    if (!orderSaved) {
      /*
       * The image is already deleted, so
       * still update the local UI.
       */
      onImagesChange(normalized);
      setBusyId(null);
      return;
    }

    onImagesChange(normalized);

    setMessage("Image removed.");
    setBusyId(null);
  }

  if (images.length === 0) {
    return (
      <div className="border border-dashed border-black/15 px-6 py-14 text-center">
        <p className="font-serif text-xl">
          No images yet.
        </p>

        <p className="mt-2 text-xs text-black/40">
          Upload vehicle photography below.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-[0.18em] text-black/35">
            Image arrangement
          </p>

          <p className="mt-1 text-[7px] uppercase tracking-[0.12em] text-black/25">
            Use arrows or drag images to reorder
          </p>
        </div>

        <p className="text-[8px] uppercase tracking-[0.15em] text-black/35">
          {images.length}{" "}
          {images.length === 1
            ? "image"
            : "images"}
        </p>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => {
          const busy =
            busyId === image.id;

          const dragging =
            draggedId === image.id;

          const dragTarget =
            dragOverId === image.id;

          const columns =
            typeof window !== "undefined"
              ? getGridColumns()
              : 4;

          const column =
            index % columns;

          const isFirstColumn =
            column === 0;

          const isLastColumn =
            column === columns - 1 ||
            index === images.length - 1;

          const canMoveUp =
            index - columns >= 0;

          const canMoveDown =
            index + columns <
            images.length;

          const canMoveLeft =
            !isFirstColumn;

          const canMoveRight =
            !isLastColumn;

          return (
            <div
              key={image.id}
              draggable={!busy}
              onDragStart={(event) =>
                handleDragStart(
                  event,
                  image.id
                )
              }
              onDragOver={(event) =>
                handleDragOver(
                  event,
                  image.id
                )
              }
              onDragLeave={() =>
                handleDragLeave(
                  image.id
                )
              }
              onDrop={(event) =>
                handleDrop(
                  event,
                  image.id
                )
              }
              onDragEnd={handleDragEnd}
              className={`group overflow-hidden border bg-white transition-all duration-300 ${
                dragging
                  ? "scale-[0.98] opacity-40"
                  : ""
              } ${
                dragTarget
                  ? "border-black shadow-[0_0_0_2px_rgba(0,0,0,0.15)]"
                  : "border-black/10"
              }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                <img
                  src={image.image_url}
                  alt={
                    image.alt_text ||
                    "Vehicle photography"
                  }
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Primary badge */}
                {image.is_primary && (
                  <div className="absolute left-2 top-2 flex items-center gap-1.5 bg-white px-2 py-1 shadow-sm">
                    <Check
                      size={9}
                      strokeWidth={1.7}
                    />

                    <span className="text-[7px] font-medium uppercase tracking-[0.15em]">
                      Primary
                    </span>
                  </div>
                )}

                {/* Drag handle */}
                <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black/45 text-white backdrop-blur-sm">
                  <GripVertical
                    size={13}
                    strokeWidth={1.2}
                  />
                </div>

                {/* Busy overlay */}
                {busy && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                    <Loader2
                      size={20}
                      strokeWidth={1.2}
                      className="animate-spin text-white"
                    />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="border-t border-black/10">
                {/* Image number */}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-[7px] uppercase tracking-[0.14em] text-black/35">
                    Image {index + 1}
                  </span>

                  <span className="text-[7px] uppercase tracking-[0.12em] text-black/25">
                    {image.sort_order + 1}
                  </span>
                </div>

                {/* Four directional controls */}
                <div className="grid grid-cols-4 border-t border-black/10">
                  {/* Up */}
                  <button
                    type="button"
                    disabled={
                      busy ||
                      !canMoveUp
                    }
                    onClick={() =>
                      moveImage(
                        image.id,
                        "up"
                      )
                    }
                    className="flex h-9 items-center justify-center border-r border-black/10 text-black/45 transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    aria-label="Move image up"
                    title="Move up"
                  >
                    <ArrowUp
                      size={12}
                      strokeWidth={1.3}
                    />
                  </button>

                  {/* Down */}
                  <button
                    type="button"
                    disabled={
                      busy ||
                      !canMoveDown
                    }
                    onClick={() =>
                      moveImage(
                        image.id,
                        "down"
                      )
                    }
                    className="flex h-9 items-center justify-center border-r border-black/10 text-black/45 transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    aria-label="Move image down"
                    title="Move down"
                  >
                    <ArrowDown
                      size={12}
                      strokeWidth={1.3}
                    />
                  </button>

                  {/* Left */}
                  <button
                    type="button"
                    disabled={
                      busy ||
                      !canMoveLeft
                    }
                    onClick={() =>
                      moveImage(
                        image.id,
                        "left"
                      )
                    }
                    className="flex h-9 items-center justify-center border-r border-black/10 text-black/45 transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    aria-label="Move image left"
                    title="Move left"
                  >
                    <ArrowLeft
                      size={12}
                      strokeWidth={1.3}
                    />
                  </button>

                  {/* Right */}
                  <button
                    type="button"
                    disabled={
                      busy ||
                      !canMoveRight
                    }
                    onClick={() =>
                      moveImage(
                        image.id,
                        "right"
                      )
                    }
                    className="flex h-9 items-center justify-center text-black/45 transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    aria-label="Move image right"
                    title="Move right"
                  >
                    <ArrowRight
                      size={12}
                      strokeWidth={1.3}
                    />
                  </button>
                </div>

                {/* Primary */}
                <button
                  type="button"
                  disabled={
                    busy ||
                    image.is_primary
                  }
                  onClick={() =>
                    makePrimary(
                      image.id
                    )
                  }
                  className="flex h-9 w-full items-center justify-center gap-2 border-t border-black/10 text-[7px] font-medium uppercase tracking-[0.1em] text-black/45 transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                >
                  {image.is_primary && (
                    <Check
                      size={10}
                      strokeWidth={1.5}
                    />
                  )}

                  {image.is_primary
                    ? "Primary image"
                    : "Make primary"}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    deleteImage(image)
                  }
                  className="flex h-9 w-full items-center justify-center gap-2 border-t border-black/10 text-[7px] uppercase tracking-[0.12em] text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Trash2
                    size={11}
                    strokeWidth={1.3}
                  />

                  Remove image
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      {message && (
        <p className="mt-4 text-[8px] uppercase tracking-[0.14em] text-black/40">
          {message}
        </p>
      )}
    </div>
  );
}