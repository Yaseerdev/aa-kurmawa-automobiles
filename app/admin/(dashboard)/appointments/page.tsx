import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Phone,
} from "lucide-react";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase-server";

type Appointment = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  appointment_date: string;
  appointment_time: string;
  message: string | null;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";
  created_at: string;
  vehicle: {
    brand: string;
    model: string;
    year: number;
  } | null;
};

async function getAppointments() {
  const supabase = await createSupabaseServerClient();

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
      vehicle:vehicles (
        brand,
        model,
        year
      )
    `)
    .order("appointment_date", {
      ascending: true,
    })
    .order("appointment_time", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Failed to load appointments:",
      error
    );

    return [];
  }

  return (data ?? []).map((appointment) => ({
    ...appointment,
    vehicle: Array.isArray(appointment.vehicle)
      ? appointment.vehicle[0] ?? null
      : appointment.vehicle,
  })) as Appointment[];
}

async function updateAppointmentStatus(
  formData: FormData
) {
  "use server";

  const appointmentId =
    formData.get("appointmentId");

  const status = formData.get("status");

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
      status,
      updated_at: new Date().toISOString(),
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
  revalidatePath("/admin");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function AppointmentsPage() {
  const appointments =
    await getAppointments();

  const pendingCount =
    appointments.filter(
      (appointment) =>
        appointment.status === "PENDING"
    ).length;

  const confirmedCount =
    appointments.filter(
      (appointment) =>
        appointment.status === "CONFIRMED"
    ).length;

  const completedCount =
    appointments.filter(
      (appointment) =>
        appointment.status === "COMPLETED"
    ).length;

  const cancelledCount =
    appointments.filter(
      (appointment) =>
        appointment.status === "CANCELLED"
    ).length;

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#090b0d]">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Showroom
            </p>

            <p className="mt-1 font-serif text-xl tracking-[-0.02em]">
              Appointments
            </p>
          </div>

          <Link
            href="/admin"
            className="text-[9px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:text-black"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
        {/* Intro */}
        <div className="mb-12">
          <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
            Showroom schedule
          </p>

          <div className="mt-3 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-serif text-4xl tracking-[-0.035em] sm:text-5xl">
                Appointments.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
                Manage vehicle inspections and
                showroom appointments from one
                place.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6">
              <Stat
                label="Pending"
                value={pendingCount}
              />

              <Stat
                label="Confirmed"
                value={confirmedCount}
              />

              <Stat
                label="Completed"
                value={completedCount}
              />

              <Stat
                label="Cancelled"
                value={cancelledCount}
              />
            </div>
          </div>
        </div>

        {/* Empty state */}
        {appointments.length === 0 ? (
          <div className="border border-black/10 bg-white/30 px-6 py-24 text-center">
            <CalendarDays
              size={24}
              strokeWidth={1.2}
              className="mx-auto text-black/25"
            />

            <p className="mt-6 font-serif text-2xl">
              No appointments yet.
            </p>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/45">
              Customer inspection requests will
              appear here automatically when
              appointments are submitted through
              the website.
            </p>
          </div>
        ) : (
          <section className="border border-black/10">
            {/* Table header */}
            <div className="hidden grid-cols-[1.3fr_1.25fr_1.25fr_1fr_1.15fr] border-b border-black/10 bg-black/[0.015] px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-black/40 lg:grid">
              <span>Customer</span>
              <span>Vehicle</span>
              <span>Schedule</span>
              <span>Status</span>
              <span>Contact</span>
            </div>

            {/* Appointments */}
            <div>
              {appointments.map(
                (appointment) => (
                  <article
                    key={appointment.id}
                    className="border-b border-black/10 p-6 last:border-b-0 lg:grid lg:grid-cols-[1.3fr_1.25fr_1.25fr_1fr_1.15fr] lg:items-center lg:gap-6"
                  >
                    {/* Customer */}
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 lg:hidden">
                        Customer
                      </p>

                      <h2 className="mt-2 font-serif text-xl lg:mt-0">
                        {appointment.name}
                      </h2>

                      {appointment.message && (
                        <p className="mt-2 max-w-sm text-xs leading-5 text-black/45">
                          {appointment.message}
                        </p>
                      )}
                    </div>

                    {/* Vehicle */}
                    <div className="mt-6 lg:mt-0">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 lg:hidden">
                        Vehicle
                      </p>

                      {appointment.vehicle ? (
                        <div>
                          <p className="text-sm">
                            {
                              appointment.vehicle
                                .year
                            }{" "}
                            {
                              appointment.vehicle
                                .brand
                            }{" "}
                            {
                              appointment.vehicle
                                .model
                            }
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-black/40">
                          General appointment
                        </p>
                      )}
                    </div>

                    {/* Schedule */}
                    <div className="mt-6 lg:mt-0">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 lg:hidden">
                        Schedule
                      </p>

                      <div className="mt-2 space-y-2 lg:mt-0">
                        <div className="flex items-center gap-2 text-xs">
                          <CalendarDays
                            size={13}
                            strokeWidth={1.3}
                            className="text-black/40"
                          />

                          <span>
                            {formatDate(
                              appointment.appointment_date
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-black/50">
                          <Clock3
                            size={13}
                            strokeWidth={1.3}
                          />

                          <span>
                            {formatTime(
                              appointment.appointment_time
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-6 lg:mt-0">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 lg:hidden">
                        Status
                      </p>

                      <form
                        action={
                          updateAppointmentStatus
                        }
                        className="mt-2 flex items-center gap-3 lg:mt-0"
                      >
                        <input
                          type="hidden"
                          name="appointmentId"
                          value={
                            appointment.id
                          }
                        />

                        <select
                          name="status"
                          defaultValue={
                            appointment.status
                          }
                          className="w-full border-b border-black/15 bg-transparent py-2 text-xs outline-none"
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
                          className="shrink-0 text-[8px] uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black"
                        >
                          Save
                        </button>
                      </form>
                    </div>

                    {/* Contact */}
                    <div className="mt-6 lg:mt-0">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 lg:hidden">
                        Contact
                      </p>

                      <div className="mt-2 space-y-2 lg:mt-0">
                        {appointment.phone && (
                          <a
                            href={`tel:${appointment.phone}`}
                            className="flex items-center gap-2 text-xs hover:underline"
                          >
                            <Phone
                              size={12}
                              strokeWidth={1.3}
                            />

                            {
                              appointment.phone
                            }
                          </a>
                        )}

                        {appointment.email && (
                          <a
                            href={`mailto:${appointment.email}`}
                            className="block break-all text-xs text-black/45 hover:text-black"
                          >
                            {
                              appointment.email
                            }
                          </a>
                        )}

                        <Link
                          href={`/admin/appointments/${appointment.id}`}
                          className="group mt-3 inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.15em] text-black/40 hover:text-black"
                        >
                          View details

                          <ArrowUpRight
                            size={11}
                            strokeWidth={1.3}
                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <p className="text-[8px] uppercase tracking-[0.18em] text-black/40">
        {label}
      </p>

      <p className="mt-2 font-serif text-2xl">
        {value}
      </p>
    </div>
  );
}