"use client";

import { useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

type AppointmentFormProps = {
  vehicleId: string;
  vehicleName: string;
};

export default function AppointmentForm({
  vehicleId,
  vehicleName,
}: AppointmentFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    appointmentDate: "",
    appointmentTime: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId,
          vehicleName,
          name: form.name,
          phone: form.phone,
          email: form.email,
          appointmentDate: form.appointmentDate,
          appointmentTime: form.appointmentTime,
          message: form.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to book your appointment."
        );
      }

      setStatus("success");

      setForm({
        name: "",
        phone: "",
        email: "",
        appointmentDate: "",
        appointmentTime: "",
        message: "",
      });
    } catch (error) {
      console.error("Appointment submission error:", error);

      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <section className="overflow-hidden border border-black/10 bg-white">
        <div className="px-6 py-14 text-center sm:px-8 sm:py-16">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-black/15">
            <Check
              size={18}
              strokeWidth={1.2}
              className="text-black"
            />
          </div>

          <p className="mt-7 text-[8px] font-medium uppercase tracking-[0.3em] text-black/55">
            Request received
          </p>

          <h3 className="mt-3 font-serif text-3xl tracking-[-0.035em] text-black">
            Appointment requested.
          </h3>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-black/60">
            Thank you. Our showroom team will contact
            you to confirm your appointment.
          </p>

          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-8 border-b border-black/25 pb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-black transition hover:border-black"
          >
            Book another appointment
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden border border-black/10 bg-white">
      {/* Header */}
      <div className="border-b border-black/10 px-6 py-7 sm:px-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-black/55">
              Showroom
            </p>

            <h3 className="mt-3 font-serif text-3xl tracking-[-0.035em] text-black sm:text-4xl">
              Book an inspection.
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-black/60">
              Choose a convenient date and time to view
              this vehicle at our showroom.
            </p>
          </div>

          <div className="hidden h-10 w-10 shrink-0 items-center justify-center border border-black/15 sm:flex">
            <CalendarDays
              size={16}
              strokeWidth={1.1}
              className="text-black"
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="px-6 py-7 sm:px-8 sm:py-8"
      >
        <div className="grid gap-x-7 gap-y-7 md:grid-cols-2">
          <Field label="Full name" required>
            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="Your full name"
              required
              autoComplete="name"
              className={inputClass}
            />
          </Field>

          <Field label="Phone number" required>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateField("phone", event.target.value)
              }
              placeholder="0800 000 0000"
              required
              autoComplete="tel"
              className={inputClass}
            />
          </Field>

          <Field label="Email address">
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
            />
          </Field>

          <Field label="Preferred date" required>
            <div className="relative">
              <CalendarDays
                size={14}
                strokeWidth={1.1}
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-black/45"
              />

              <input
                type="date"
                min={today}
                value={form.appointmentDate}
                onChange={(event) =>
                  updateField(
                    "appointmentDate",
                    event.target.value
                  )
                }
                required
                className={`${inputClass} pl-7`}
              />
            </div>
          </Field>

          <Field label="Preferred time" required>
            <div className="relative">
              <Clock3
                size={14}
                strokeWidth={1.1}
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-black/45"
              />

              <input
                type="time"
                value={form.appointmentTime}
                onChange={(event) =>
                  updateField(
                    "appointmentTime",
                    event.target.value
                  )
                }
                required
                className={`${inputClass} pl-7`}
              />
            </div>
          </Field>

          <Field
            label="Message"
            className="md:col-span-2"
          >
            <textarea
              value={form.message}
              onChange={(event) =>
                updateField("message", event.target.value)
              }
              placeholder="Anything you'd like our team to know?"
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        {status === "error" && (
          <div className="mt-7 border border-red-900/15 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-8 border-t border-black/10 pt-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="max-w-xs text-[10px] leading-5 text-black/55">
                Your appointment is a request and will be
                confirmed by our showroom team.
              </p>

              <p className="mt-2 text-[8px] uppercase tracking-[0.18em] text-black/40">
                AA Kurmawa Automobiles
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 bg-black px-7 text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2
                    size={14}
                    className="animate-spin"
                    strokeWidth={1.2}
                  />
                  Sending request
                </>
              ) : (
                <>
                  Request appointment
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.3}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2.5 block text-[8px] font-medium uppercase tracking-[0.22em] text-black/55">
        {label}
        {required && (
          <span className="ml-1 text-black">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  "w-full border-b border-black/20 bg-transparent py-3 text-sm leading-6 text-black outline-none placeholder:text-black/30 transition-colors focus:border-black";