"use client";

import { Check, Loader2, Save } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SaveSettingsButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-8 flex w-full cursor-pointer items-center justify-center gap-3 bg-[#090b0d] px-6 py-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-black/80 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2
            size={13}
            strokeWidth={1.4}
            className="animate-spin"
          />

          Saving...
        </>
      ) : (
        <>
          <Save
            size={13}
            strokeWidth={1.2}
          />

          Save settings
        </>
      )}
    </button>
  );
}