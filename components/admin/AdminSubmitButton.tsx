"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

type AdminSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  pending?: boolean;
  className?: string;
  form?: string;
};

export function AdminSubmitButton({
  label,
  pendingLabel = "Saving...",
  pending = false,
  className = "",
  form,
}: AdminSubmitButtonProps) {
  const { pending: formPending } = useFormStatus();

  const isPending = pending || formPending;

  return (
    <button
      type="submit"
      form={form}
      disabled={isPending}
      aria-disabled={isPending}
      className={`inline-flex items-center justify-center gap-3 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isPending ? (
        <>
          <Loader2
            size={14}
            strokeWidth={1.3}
            className="animate-spin"
          />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}