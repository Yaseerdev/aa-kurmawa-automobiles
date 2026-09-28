import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  Phone,
  User,
  Car,
} from "lucide-react";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase-server";

type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

type Appointment = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  appointment_date: string;
  appointment_time: string;
  message: string | null;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  vehicle: {
    id: string;
    slug: string;
    brand: string;
    model: string;
    year: number;
    price: number | null;
    currency: string;
  } | null;
};

async function getAppointment(
  id: string
): Promise<Appointment | null> {
  const supabase =
    await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      name,
      email,
      phone,
      appointment_date,
      appointment_time,
      message,
      status,
      created_at,
      updated_at,
      vehicle:vehicles (
        id,
        slug,
        brand,
        model,
        year,
        price,
        currency
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load appointment:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    vehicle: Array.isArray(data.vehicle)
      ? data.vehicle[0] ?? null
      : data.vehicle,
  } as Appointment;
}

async function updateAppointmentStatus(
  formData: FormData
) {
  "use server";

  const appointmentId =
    formData.get("appointmentId");

  const status =
    formData.get("status");

  if (
    typeof appointmentId !== "string" ||
    ![
      "PENDING",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
    ].includes(String(status))
  ) {
    return;
  }

  const supabase =
    await createSupabaseServerClient();

  const { error } = await supabase
    .from("appointments")
    .update({
      status: String(status),
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", appointmentId);

  if (error) {
    console.error(
      "Failed to update appointment:",
      error
    );

    return;
  }

  revalidatePath("/admin/appointments");
  revalidatePath(
    `/admin/appointments/${appointmentId}`
  );
  revalidatePath("/admin");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-NG",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(
    new Date(`${date}T00:00:00`)
  );
}

function formatTime(time: string) {
  const [hours, minutes] =
    time.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date);
}

function formatSubmittedDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(date));
}

function getStatusLabel(
  status: AppointmentStatus
) {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return "Pending";
  }
}

function getStatusClass(
  status: AppointmentStatus
) {
  switch (status) {
    case "CONFIRMED":
      return "border-black/15 bg-black text-white";

    case "COMPLETED":
      return "border-black/15 bg-black/[0.05] text-black";

    case "CANCELLED":
      return "border-red-900/10 bg-red-50 text-red-700";

    default:
      return "border-[#caa85e]/40 bg-[#caa85e]/10 text-[#8a6a27]";
  }
}

export default async function AppointmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const appointment =
    await getAppointment(id);

  if (!appointment) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#090b0d]">
      {/* Header */}
      <header className="border-b border-black/10 bg-[#f4f2ed]">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Showroom
            </p>

            <p className="mt-1 font-serif text-xl tracking-[-0.02em]">
              Appointment details
            </p>
          </div>

          <Link
            href="/admin/appointments"
            className="group flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:text-black"
          >
            <ArrowLeft
              size={12}
              strokeWidth={1.4}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back to appointments
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
        {/* Page intro */}
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Showroom request
            </p>

            <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">
              {appointment.name}.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
              Review the customer&apos;s
              inspection request and manage
              the appointment status.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center border px-4 py-2 text-[9px] uppercase tracking-[0.18em] ${getStatusClass(
              appointment.status
            )}`}
          >
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />

            {getStatusLabel(
              appointment.status
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          {/* Left */}
          <div className="space-y-8">
            {/* Customer */}
            <section className="border border-black/10 bg-white/25">
              <div className="border-b border-black/10 px-6 py-5 lg:px-8">
                <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
                  Customer
                </p>

                <h2 className="mt-2 font-serif text-2xl tracking-[-0.02em]">
                  Customer information.
                </h2>
              </div>

              <div className="grid md:grid-cols-2">
                <InfoItem
                  icon={<User size={15} strokeWidth={1.2} />}
                  label="Full name"
                  value={appointment.name}
                />

                <InfoItem
                  icon={<Phone size={15} strokeWidth={1.2} />}
                  label="Phone number"
                  value={
                    appointment.phone ??
                    "Not provided"
                  }
                  href={
                    appointment.phone
                      ? `tel:${appointment.phone}`
                      : undefined
                  }
                />

                <InfoItem
                  icon={<Mail size={15} strokeWidth={1.2} />}
                  label="Email address"
                  value={
                    appointment.email ??
                    "Not provided"
                  }
                  href={
                    appointment.email
                      ? `mailto:${appointment.email}`
                      : undefined
                  }
                />

                <InfoItem
                  icon={
                    <Clock3
                      size={15}
                      strokeWidth={1.2}
                    />
                  }
                  label="Request received"
                  value={formatSubmittedDate(
                    appointment.created_at
                  )}
                />
              </div>
            </section>

            {/* Appointment */}
            <section className="border border-black/10 bg-white/25">
              <div className="border-b border-black/10 px-6 py-5 lg:px-8">
                <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
                  Schedule
                </p>

                <h2 className="mt-2 font-serif text-2xl tracking-[-0.02em]">
                  Inspection appointment.
                </h2>
              </div>

              <div className="grid md:grid-cols-2">
                <InfoItem
                  icon={
                    <CalendarDays
                      size={15}
                      strokeWidth={1.2}
                    />
                  }
                  label="Preferred date"
                  value={formatDate(
                    appointment.appointment_date
                  )}
                />

                <InfoItem
                  icon={
                    <Clock3
                      size={15}
                      strokeWidth={1.2}
                    />
                  }
                  label="Preferred time"
                  value={formatTime(
                    appointment.appointment_time
                  )}
                />
              </div>

              {appointment.message && (
                <div className="border-t border-black/10 px-6 py-6 lg:px-8">
                  <p className="text-[8px] uppercase tracking-[0.22em] text-black/35">
                    Customer message
                  </p>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-black/65">
                    {appointment.message}
                  </p>
                </div>
              )}
            </section>

            {/* Vehicle */}
            <section className="border border-black/10 bg-white/25">
              <div className="border-b border-black/10 px-6 py-5 lg:px-8">
                <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
                  Vehicle
                </p>

                <h2 className="mt-2 font-serif text-2xl tracking-[-0.02em]">
                  Requested vehicle.
                </h2>
              </div>

              {appointment.vehicle ? (
                <div className="flex flex-col justify-between gap-6 px-6 py-7 sm:flex-row sm:items-center lg:px-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/10 bg-black/[0.02]">
                      <Car
                        size={17}
                        strokeWidth={1.2}
                      />
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                        {appointment.vehicle.brand}
                      </p>

                      <h3 className="mt-1 font-serif text-xl">
                        {appointment.vehicle.year}{" "}
                        {appointment.vehicle.model}
                      </h3>
                    </div>
                  </div>

                  <Link
                    href={`/vehicles/${appointment.vehicle.slug}`}
                    target="_blank"
                    className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-black/45 transition-colors hover:text-black"
                  >
                    View vehicle

                    <ArrowUpRight
                      size={12}
                      strokeWidth={1.3}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              ) : (
                <div className="px-6 py-8 lg:px-8">
                  <p className="text-sm text-black/45">
                    General showroom appointment.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <section className="border border-black/10 bg-white/30">
              {/* Status header */}
              <div className="border-b border-black/10 px-6 py-6 lg:px-8">
                <p className="text-[9px] uppercase tracking-[0.25em] text-black/40">
                  Appointment status
                </p>

                <h2 className="mt-2 font-serif text-2xl tracking-[-0.02em]">
                  Manage request.
                </h2>

                <p className="mt-3 text-xs leading-5 text-black/45">
                  Update the appointment as
                  your showroom team handles
                  the customer request.
                </p>
              </div>

              {/* Status controls */}
              <div className="px-6 py-6 lg:px-8">
                <form
                  action={
                    updateAppointmentStatus
                  }
                >
                  <input
                    type="hidden"
                    name="appointmentId"
                    value={appointment.id}
                  />

                  <label className="text-[8px] uppercase tracking-[0.2em] text-black/40">
                    Current status
                  </label>

                  <select
                    name="status"
                    defaultValue={
                      appointment.status
                    }
                    className="mt-3 w-full border-b border-black/15 bg-transparent py-3 text-sm outline-none transition-colors focus:border-black"
                  >
                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="CONFIRMED">
                      Confirmed
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>
                  </select>

                  <button
                    type="submit"
                    className="mt-6 flex w-full items-center justify-center gap-3 bg-[#090b0d] px-5 py-4 text-[9px] uppercase tracking-[0.2em] text-white transition-all hover:bg-black/80"
                  >
                    <Check
                      size={13}
                      strokeWidth={1.4}
                    />

                    Save status
                  </button>
                </form>
              </div>

              {/* Contact actions */}
              <div className="border-t border-black/10 p-6 lg:p-8">
                <p className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                  Contact customer
                </p>

                <div className="mt-5 space-y-3">
                  {appointment.phone && (
                    <a
                      href={`tel:${appointment.phone}`}
                      className="flex items-center justify-between border border-black/10 px-4 py-3 text-[9px] uppercase tracking-[0.15em] transition-colors hover:border-black/30 hover:bg-black/[0.02]"
                    >
                      <span className="flex items-center gap-3">
                        <Phone
                          size={13}
                          strokeWidth={1.2}
                        />

                        Call customer
                      </span>

                      <ArrowUpRight
                        size={12}
                        strokeWidth={1.2}
                      />
                    </a>
                  )}

                  {appointment.email && (
                    <a
                      href={`mailto:${appointment.email}`}
                      className="flex items-center justify-between border border-black/10 px-4 py-3 text-[9px] uppercase tracking-[0.15em] transition-colors hover:border-black/30 hover:bg-black/[0.02]"
                    >
                      <span className="flex items-center gap-3">
                        <Mail
                          size={13}
                          strokeWidth={1.2}
                        />

                        Send email
                      </span>

                      <ArrowUpRight
                        size={12}
                        strokeWidth={1.2}
                      />
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* Meta */}
            <div className="mt-5 px-1">
              <p className="text-[8px] uppercase tracking-[0.18em] text-black/30">
                Appointment ID
              </p>

              <p className="mt-2 break-all font-mono text-[9px] text-black/35">
                {appointment.id}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center gap-3 text-black/35">
        {icon}

        <p className="text-[8px] uppercase tracking-[0.2em]">
          {label}
        </p>
      </div>

      <p className="mt-4 text-sm text-black/75">
        {value}
      </p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="border-b border-black/10 px-6 py-6 transition-colors hover:bg-black/[0.02] lg:px-8"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="border-b border-black/10 px-6 py-6 lg:px-8">
      {content}
    </div>
  );
}