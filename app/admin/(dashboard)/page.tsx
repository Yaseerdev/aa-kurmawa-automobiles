import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase-server";

type Vehicle = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number | null;
  currency: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  featured: boolean;
  published: boolean;
};

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED";
  created_at: string;
  vehicle: {
    brand: string;
    model: string;
    year: number;
  } | null;
};

type Appointment = {
  id: string;
  name: string;
  phone: string | null;
  appointment_date: string;
  appointment_time: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";
  vehicle: {
    brand: string;
    model: string;
    year: number;
  } | null;
};

async function getDashboardData() {
  const supabase =
    await createSupabaseServerClient();

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [
    vehiclesResult,
    leadsResult,
    appointmentsResult,
  ] = await Promise.all([
    supabase
      .from("vehicles")
      .select(
        `
          id,
          slug,
          brand,
          model,
          year,
          price,
          currency,
          status,
          featured,
          published
        `
      )
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("leads")
      .select(
        `
          id,
          name,
          phone,
          email,
          message,
          status,
          created_at,
          vehicle:vehicles (
            brand,
            model,
            year
          )
        `
      )
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("appointments")
      .select(
        `
          id,
          name,
          phone,
          appointment_date,
          appointment_time,
          status,
          vehicle:vehicles (
            brand,
            model,
            year
          )
        `
      )
      .gte(
        "appointment_date",
        today
      )
      .neq(
        "status",
        "CANCELLED"
      )
      .order("appointment_date", {
        ascending: true,
      })
      .order("appointment_time", {
        ascending: true,
      }),
  ]);

  if (vehiclesResult.error) {
    console.error(
      "Dashboard vehicles error:",
      vehiclesResult.error
    );
  }

  if (leadsResult.error) {
    console.error(
      "Dashboard leads error:",
      leadsResult.error
    );
  }

  if (appointmentsResult.error) {
    console.error(
      "Dashboard appointments error:",
      appointmentsResult.error
    );
  }

  const vehicles =
    (vehiclesResult.data ??
      []) as Vehicle[];

  const leads =
    (leadsResult.data ?? []).map(
      (lead) => ({
        ...lead,
        vehicle: Array.isArray(
          lead.vehicle
        )
          ? lead.vehicle[0] ?? null
          : lead.vehicle,
      })
    ) as Lead[];

  const appointments =
    (appointmentsResult.data ?? []).map(
      (appointment) => ({
        ...appointment,
        vehicle: Array.isArray(
          appointment.vehicle
        )
          ? appointment.vehicle[0] ?? null
          : appointment.vehicle,
      })
    ) as Appointment[];

  return {
    vehicles,
    leads,
    appointments,
  };
}

function formatPrice(
  price: number | null,
  currency: string
) {
  if (price === null) {
    return "Price on request";
  }

  try {
    return new Intl.NumberFormat(
      "en-NG",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }
    ).format(price);
  } catch {
    return `${currency} ${price.toLocaleString(
      "en-NG"
    )}`;
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-NG",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
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

function formatRelativeDate(
  date: string
) {
  const created =
    new Date(date).getTime();

  const now = Date.now();

  const difference =
    Math.max(
      0,
      now - created
    );

  const minutes = Math.floor(
    difference / 60000
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
    }
  ).format(new Date(date));
}

function getLeadStatusClass(
  status: Lead["status"]
) {
  switch (status) {
    case "CONTACTED":
      return "bg-black/[0.05] text-black/55";

    case "CLOSED":
      return "bg-black/[0.03] text-black/30";

    default:
      return "bg-[#d7b56d]/15 text-[#866722]";
  }
}

function getAppointmentStatusClass(
  status: Appointment["status"]
) {
  switch (status) {
    case "CONFIRMED":
      return "bg-black text-white";

    case "COMPLETED":
      return "bg-black/[0.05] text-black/55";

    default:
      return "bg-[#d7b56d]/15 text-[#866722]";
  }
}

export default async function AdminDashboardPage() {
  const {
    vehicles,
    leads,
    appointments,
  } = await getDashboardData();

  const totalVehicles =
    vehicles.length;

  const availableVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.status ===
        "AVAILABLE"
    ).length;

  const reservedVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.status ===
        "RESERVED"
    ).length;

  const soldVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.status ===
        "SOLD"
    ).length;

  const newLeads =
    leads.filter(
      (lead) =>
        lead.status === "NEW"
    ).length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "PENDING"
    ).length;

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "CONFIRMED"
    ).length;

  const featuredVehicles =
    vehicles
      .filter(
        (vehicle) =>
          vehicle.featured &&
          vehicle.published
      )
      .slice(0, 3);

  const recentLeads =
    leads.slice(0, 5);

  const upcomingAppointments =
    appointments.slice(0, 5);

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#090b0d]">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="flex min-h-20 items-center justify-between gap-6 px-6 lg:px-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/35">
              AA Kurmawa Automobiles
            </p>

            <h1 className="mt-1 font-serif text-2xl tracking-[-0.025em]">
              Dashboard
            </h1>
          </div>

          <Link
            href="/"
            target="_blank"
            className="group hidden items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-black/40 transition-colors hover:text-black sm:flex"
          >
            View website

            <ArrowUpRight
              size={12}
              strokeWidth={1.3}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-10 lg:px-10 lg:py-14">
        {/* Intro */}
        <section className="mb-12">
          <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
            Overview
          </p>

          <div className="mt-3 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <h2 className="font-serif text-4xl tracking-[-0.04em] sm:text-5xl">
                Your showroom.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-black/45">
                A live overview of your inventory,
                customer enquiries and showroom
                appointments.
              </p>
            </div>

            <Link
              href="/admin/vehicles/new"
              className="group inline-flex w-fit items-center gap-3 bg-[#090b0d] px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85"
            >
              <Plus
                size={14}
                strokeWidth={1.3}
              />

              Add vehicle

              <ArrowUpRight
                size={12}
                strokeWidth={1.3}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid border border-black/10 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={
              <Car
                size={17}
                strokeWidth={1.2}
              />
            }
            label="Total vehicles"
            value={totalVehicles}
            detail={`${availableVehicles} available`}
            href="/admin/vehicles"
          />

          <StatCard
            icon={
              <MessageSquare
                size={17}
                strokeWidth={1.2}
              />
            }
            label="New enquiries"
            value={newLeads}
            detail={`${leads.length} total enquiries`}
            href="/admin/leads"
            accent={
              newLeads > 0
            }
          />

          <StatCard
            icon={
              <CalendarDays
                size={17}
                strokeWidth={1.2}
              />
            }
            label="Pending appointments"
            value={
              pendingAppointments
            }
            detail={`${confirmedAppointments} confirmed`}
            href="/admin/appointments"
            accent={
              pendingAppointments >
              0
            }
          />

          <StatCard
            icon={
              <TrendingUp
                size={17}
                strokeWidth={1.2}
              />
            }
            label="Vehicles sold"
            value={soldVehicles}
            detail={`${reservedVehicles} reserved`}
            href="/admin/vehicles"
          />
        </section>

        {/* Main grid */}
        <div className="mt-10 grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Recent enquiries */}
          <section className="border border-black/10 bg-white/20">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 lg:px-7">
              <div>
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Customers
                </p>

                <h3 className="mt-2 font-serif text-2xl tracking-[-0.025em]">
                  Recent enquiries.
                </h3>
              </div>

              <Link
                href="/admin/leads"
                className="group flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-black/40 transition-colors hover:text-black"
              >
                View all

                <ArrowUpRight
                  size={11}
                  strokeWidth={1.3}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {recentLeads.length ===
            0 ? (
              <EmptyBlock
                icon={
                  <MessageSquare
                    size={20}
                    strokeWidth={1.2}
                  />
                }
                title="No enquiries yet."
                text="Customer enquiries will appear here automatically."
              />
            ) : (
              <div>
                {recentLeads.map(
                  (lead) => (
                    <div
                      key={lead.id}
                      className="border-b border-black/10 px-6 py-5 last:border-b-0 lg:px-7"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <h4 className="truncate font-serif text-lg">
                              {lead.name}
                            </h4>

                            <span
                              className={`shrink-0 px-2 py-1 text-[7px] uppercase tracking-[0.15em] ${getLeadStatusClass(
                                lead.status
                              )}`}
                            >
                              {lead.status ===
                              "NEW"
                                ? "New"
                                : lead.status ===
                                  "CONTACTED"
                                ? "Contacted"
                                : "Closed"}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-black/45">
                            {lead.vehicle
                              ? `${lead.vehicle.year} ${lead.vehicle.brand} ${lead.vehicle.model}`
                              : "General enquiry"}
                          </p>

                          {lead.message && (
                            <p className="mt-2 line-clamp-1 max-w-lg text-xs text-black/35">
                              {lead.message}
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 text-[8px] uppercase tracking-[0.12em] text-black/30">
                          {formatRelativeDate(
                            lead.created_at
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* Upcoming appointments */}
          <section className="border border-black/10 bg-white/20">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 lg:px-7">
              <div>
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Showroom
                </p>

                <h3 className="mt-2 font-serif text-2xl tracking-[-0.025em]">
                  Upcoming appointments.
                </h3>
              </div>

              <Link
                href="/admin/appointments"
                className="group flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-black/40 transition-colors hover:text-black"
              >
                View all

                <ArrowUpRight
                  size={11}
                  strokeWidth={1.3}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {upcomingAppointments.length ===
            0 ? (
              <EmptyBlock
                icon={
                  <CalendarDays
                    size={20}
                    strokeWidth={1.2}
                  />
                }
                title="No upcoming appointments."
                text="New showroom requests will appear here."
              />
            ) : (
              <div>
                {upcomingAppointments.map(
                  (appointment) => (
                    <Link
                      key={
                        appointment.id
                      }
                      href={`/admin/appointments/${appointment.id}`}
                      className="group block border-b border-black/10 px-6 py-5 last:border-b-0 transition-colors hover:bg-black/[0.02] lg:px-7"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-serif text-lg">
                              {
                                appointment.name
                              }
                            </h4>

                            <span
                              className={`px-2 py-1 text-[7px] uppercase tracking-[0.15em] ${getAppointmentStatusClass(
                                appointment.status
                              )}`}
                            >
                              {appointment.status ===
                              "CONFIRMED"
                                ? "Confirmed"
                                : "Pending"}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-black/45">
                            {appointment.vehicle
                              ? `${appointment.vehicle.year} ${appointment.vehicle.brand} ${appointment.vehicle.model}`
                              : "General showroom appointment"}
                          </p>
                        </div>

                        <ArrowUpRight
                          size={13}
                          strokeWidth={1.2}
                          className="shrink-0 text-black/25 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </div>

                      <div className="mt-4 flex items-center gap-5 text-[8px] uppercase tracking-[0.13em] text-black/40">
                        <span className="flex items-center gap-2">
                          <CalendarDays
                            size={12}
                            strokeWidth={1.2}
                          />

                          {formatDate(
                            appointment.appointment_date
                          )}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock3
                            size={12}
                            strokeWidth={1.2}
                          />

                          {formatTime(
                            appointment.appointment_time
                          )}
                        </span>
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </section>
        </div>

        {/* Featured inventory */}
        <section className="mt-10 border border-black/10 bg-white/20">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 lg:px-7">
            <div>
              <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                Collection
              </p>

              <h3 className="mt-2 font-serif text-2xl tracking-[-0.025em]">
                Featured inventory.
              </h3>
            </div>

            <Link
              href="/admin/vehicles"
              className="group flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-black/40 transition-colors hover:text-black"
            >
              Manage inventory

              <ArrowUpRight
                size={11}
                strokeWidth={1.3}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {featuredVehicles.length ===
          0 ? (
            <div className="px-6 py-14 text-center">
              <Car
                size={21}
                strokeWidth={1.2}
                className="mx-auto text-black/25"
              />

              <p className="mt-5 font-serif text-xl">
                No featured vehicles.
              </p>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-black/40">
                Mark vehicles as featured
                from inventory to display
                them here.
              </p>

              <Link
                href="/admin/vehicles"
                className="mt-6 inline-flex items-center gap-2 border-b border-black/20 pb-1 text-[8px] uppercase tracking-[0.18em] text-black/45 hover:text-black"
              >
                Go to inventory

                <ArrowUpRight
                  size={11}
                  strokeWidth={1.2}
                />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3">
              {featuredVehicles.map(
                (vehicle) => (
                  <Link
                    key={vehicle.id}
                    href={`/admin/vehicles/${vehicle.id}`}
                    className="group border-b border-black/10 p-6 transition-colors hover:bg-black/[0.02] md:border-b-0 md:border-r md:last:border-r-0 lg:p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                          {
                            vehicle.brand
                          }
                        </p>

                        <h4 className="mt-2 font-serif text-xl tracking-[-0.02em]">
                          {vehicle.year}{" "}
                          {
                            vehicle.model
                          }
                        </h4>
                      </div>

                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.2}
                        className="text-black/25 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </div>

                    <div className="mt-8 flex items-end justify-between">
                      <div>
                        <p className="text-[7px] uppercase tracking-[0.18em] text-black/30">
                          Price
                        </p>

                        <p className="mt-1 text-sm">
                          {formatPrice(
                            vehicle.price,
                            vehicle.currency
                          )}
                        </p>
                      </div>

                      <span className="text-[7px] uppercase tracking-[0.15em] text-black/35">
                        {
                          vehicle.status
                        }
                      </span>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="mt-10">
          <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
            Quick actions
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <QuickAction
              href="/admin/vehicles/new"
              icon={
                <Car
                  size={15}
                  strokeWidth={1.2}
                />
              }
              title="Add vehicle"
              text="Add a new vehicle to inventory."
            />

            <QuickAction
              href="/admin/leads"
              icon={
                <Users
                  size={15}
                  strokeWidth={1.2}
                />
              }
              title="Review enquiries"
              text="Follow up with prospective buyers."
            />

            <QuickAction
              href="/admin/appointments"
              icon={
                <CheckCircle2
                  size={15}
                  strokeWidth={1.2}
                />
              }
              title="Manage appointments"
              text="Review and confirm showroom visits."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
  href,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group border-b border-black/10 p-6 transition-colors hover:bg-black/[0.02] sm:nth-[2]:border-r-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
    >
      <div className="flex items-start justify-between">
        <span className="text-black/30">
          {icon}
        </span>

        <ArrowUpRight
          size={13}
          strokeWidth={1.2}
          className="text-black/20 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      <p className="mt-8 text-[8px] uppercase tracking-[0.2em] text-black/35">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-3">
        <p className="font-serif text-4xl tracking-[-0.04em]">
          {value}
        </p>

        {accent && value > 0 && (
          <span className="mb-1.5 h-1.5 w-1.5 rounded-full bg-[#17cf3f]" />
        )}
      </div>

      <p className="mt-2 text-[9px] text-black/35">
        {detail}
      </p>
    </Link>
  );
}

function EmptyBlock({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="px-6 py-14 text-center lg:px-7">
      <span className="mx-auto flex h-9 w-9 items-center justify-center border border-black/10 text-black/25">
        {icon}
      </span>

      <p className="mt-5 font-serif text-xl">
        {title}
      </p>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-black/40">
        {text}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between border border-black/10 bg-white/20 px-5 py-5 transition-colors hover:bg-black/[0.02]"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/35">
          {icon}
        </span>

        <div>
          <p className="text-[9px] uppercase tracking-[0.16em]">
            {title}
          </p>

          <p className="mt-1 text-[10px] text-black/40">
            {text}
          </p>
        </div>
      </div>

      <ArrowUpRight
        size={13}
        strokeWidth={1.2}
        className="text-black/25 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}