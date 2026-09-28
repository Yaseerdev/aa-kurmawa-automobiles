"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";

type VehicleEnquiryFormProps = {
  vehicleId: string;
  vehicleName: string;
};

export function VehicleEnquiryForm({
  vehicleId,
  vehicleName,
}: VehicleEnquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId,
          vehicleName,
          name,
          phone,
          email,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSuccess(true);

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="border-t border-black/10 pt-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15">
          <Check
            size={16}
            strokeWidth={1.2}
            className="text-black"
          />
        </div>

        <p className="mt-6 text-[8px] font-medium uppercase tracking-[0.28em] text-black/55">
          Enquiry received
        </p>

        <h3 className="mt-3 font-serif text-3xl leading-none tracking-[-0.035em] text-black">
          Thank you.
        </h3>

        <p className="mt-4 max-w-md text-sm leading-7 text-black/60">
          Our team has received your enquiry about the{" "}
          {vehicleName} and will be in touch shortly.
        </p>

        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-7 text-[9px] font-semibold uppercase tracking-[0.2em] text-black transition hover:text-black/55"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-7">
        <Field
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Your name"
          required
        />

        <Field
          label="Phone number"
          value={phone}
          onChange={setPhone}
          placeholder="0800 000 0000"
          type="tel"
          required
        />

        <Field
          label="Email address"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          type="email"
        />

        <div>
          <label className="mb-2.5 block text-[8px] font-medium uppercase tracking-[0.22em] text-black/70">
            Message
          </label>

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="I'm interested in this vehicle..."
            rows={4}
            className="w-full resize-none border-b border-black/20 bg-transparent px-0 py-3 text-sm leading-6 text-black outline-none transition-colors placeholder:text-black/45 focus:border-black"
          />
        </div>
      </div>

      {error && (
        <div className="mt-6 border border-red-900/15 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="group mt-8 inline-flex w-full items-center justify-center gap-3 bg-black px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            Sending
            <Loader2
              size={14}
              strokeWidth={1.2}
              className="animate-spin"
            />
          </>
        ) : (
          <>
            Send enquiry
            <ArrowUpRight
              size={14}
              strokeWidth={1.2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2.5 block text-[8px] font-medium uppercase tracking-[0.22em] text-black/70">
        {label}
        {required && (
          <span className="ml-1 text-black">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border-b border-black/20 bg-transparent px-0 py-3 text-sm leading-6 text-black outline-none transition-colors placeholder:text-black/45 focus:border-black"
      />
    </div>
  );
}