import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Phone,
} from "lucide-react";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { VehicleEnquiryForm } from "@/components/VehicleEnquiryForm";
import { VehicleCard } from "@/components/VehicleCard";
import AppointmentForm from "@/components/AppointmentForm";
import { VehicleGallery } from "@/components/VehicleGallery";
import { ExperienceMarquee } from "@/components/ExperienceMarquee";
import { SiteFooter } from "@/components/SiteFooter";

import {
  getPublishedVehicleBySlug,
  getRelatedVehicles,
} from "@/lib/queries/vehicles";

import {
  getVehicleStatusLabel,
  getVehicleStatusMessage,
} from "@/lib/vehicle-status";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function VehiclePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const vehicle =
    await getPublishedVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles =
    await getRelatedVehicles(vehicle.id, 2);

  const statusLabel =
    getVehicleStatusLabel(vehicle.status);

  const statusMessage =
    getVehicleStatusMessage(vehicle.status);

  const vehicleName =
    `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;

  const whatsappMessage = encodeURIComponent(
    `Hello AA Kurmawa Automobiles, I'm interested in the ${vehicleName}. Please provide more information.`
  );

  const canEnquire =
    vehicle.status === "AVAILABLE";

 return (
  <>
    <main className="min-h-screen bg-white text-black">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-md">

        <div className="mx-auto flex h-[64px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:h-[70px] sm:px-5 md:h-[74px] md:px-8 lg:px-10">

          <Link
            href="/vehicles"
            className="group flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-black transition-colors hover:text-black"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.2}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to results
          </Link>


          <nav className="hidden items-center gap-10 md:flex">

            <Link
              href="/"
              className="text-[12px] font-medium uppercase tracking-[0.2em] text-black transition-colors hover:text-black"
            >
              Home
            </Link>

            <Link
              href="/vehicles"
              className="text-[12px] font-medium uppercase tracking-[0.2em] text-black"
            >
              Current stock
            </Link>

            <span className="text-[12px] uppercase tracking-[0.20em] text-black">
              AA Kurmawa Automobiles
            </span>

          </nav>


          <a
            href="#enquiry"
           className="group inline-flex shrink-0 items-center gap-2 bg-black px-3.5 py-2.5 text-[7px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-black/80 sm:gap-3 sm:px-5 sm:py-3 sm:text-[8px]"
          >
            Enquire now

            <ArrowUpRight
              size={12}
              strokeWidth={1.2}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>

        </div>

      </header>


      {/* =========================================================
          BREADCRUMBS
      ========================================================= */}

      <section className="mx-auto max-w-[1600px] px-4 pt-5 sm:px-5 sm:pt-7 md:px-8 lg:px-10">

        <div className="flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-black sm:gap-2 sm:text-[10px]">

          <Link
            href="/"
            className="transition-colors hover:text-black"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/vehicles"
            className="transition-colors hover:text-black"
          >
            Current stock
          </Link>

          <span>/</span>

          <span className="text-black/55">
            {vehicleName}
          </span>

        </div>

      </section>


      {/* =========================================================
          MAIN VEHICLE
      ========================================================= */}

      <section className="mx-auto max-w-[1600px] px-4 pb-14 pt-5 sm:px-5 sm:pb-20 sm:pt-7 md:px-8 md:pb-28 md:pt-8 lg:px-10">

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(350px,0.75fr)]">


          {/* =====================================================
              LEFT
          ===================================================== */}

          <div className="min-w-0">


            {/* GALLERY */}

            <div className="relative">

              {vehicle.images &&
              vehicle.images.length > 0 ? (
                <VehicleGallery
                  images={vehicle.images}
                  vehicleName={vehicleName}
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-[#f2f2f0]">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-black/30">
                    No images available
                  </span>
                </div>
              )}

            </div>


                          {/* =================================================
                    VEHICLE IDENTITY
                ================================================= */}

                <div className="mt-10 border-b border-black/10 pb-10 md:mt-14 md:pb-12">
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">

                    {/* Vehicle name */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-black/25" />

                        <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-black/60">
                          {vehicle.brand}
                        </p>
                      </div>

                      <h1 className="mt-5 max-w-5xl font-serif text-[clamp(3.4rem,6vw,5.8rem)] leading-[0.88] tracking-[-0.055em] text-black">
                        {vehicle.year} {vehicle.brand} {vehicle.model}
                      </h1>

                      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <span
                          className={`inline-flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.22em] ${
                            vehicle.status === "AVAILABLE"
                              ? "text-black"
                              : "text-black/55"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              vehicle.status === "AVAILABLE"
                                ? "bg-black"
                                : "bg-black/30"
                            }`}
                          />

                          {statusLabel}
                        </span>

                        {vehicle.description && (
                          <>
                            <span className="h-3 w-px bg-black/15" />

                            <p className="text-xs leading-5 text-black/55">
                              {vehicle.description}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Asking price */}
                    <div className="lg:min-w-[190px] lg:pb-1">
                      <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-black/50">
                        Asking price
                      </p>

                      <p className="mt-3 font-serif text-3xl leading-none tracking-[-0.035em] text-black md:text-4xl">
                        {vehicle.price}
                      </p>

                      <p className="mt-3 text-[8px] uppercase tracking-[0.2em] text-black/35">
                        Subject to availability
                      </p>
                    </div>
                  </div>
                </div>

            {/* =================================================
                KEY INFORMATION
            ================================================= */}

            <section className="mt-10 md:mt-14">

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-black/40">
                    Key information
                  </p>

                  <h2 className="mt-4 font-serif text-3xl tracking-[-0.035em] md:text-4xl">
                    The specification.
                  </h2>

                </div>

                <span className="hidden h-px w-20 bg-black/20 sm:block" />

              </div>


              <div className="mt-8 border-y border-black/15">

                <div className="grid grid-cols-2 md:grid-cols-4">

                  <InfoCell
                    label="Year"
                    value={String(vehicle.year)}
                  />

                  <InfoCell
                    label="Mileage"
                    value={vehicle.mileage}
                  />

                  <InfoCell
                    label="Transmission"
                    value={vehicle.transmission}
                  />

                  <InfoCell
                    label="Fuel"
                    value={vehicle.fuel}
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                FULL SPECIFICATION
            ================================================= */}

            <section className="mt-12 md:mt-16">

              <div className="border-t border-black/15">

                <InfoRow
                  label="Body style"
                  value={vehicle.body}
                />

                <InfoRow
                  label="Engine"
                  value={
                    vehicle.engine ??
                    "Not specified"
                  }
                />

                <InfoRow
                  label="Drivetrain"
                  value={
                    vehicle.drivetrain ??
                    "Not specified"
                  }
                />

                <InfoRow
                  label="Exterior"
                  value={
                    vehicle.exteriorColor ??
                    "Not specified"
                  }
                />

                <InfoRow
                  label="Interior"
                  value={
                    vehicle.interiorColor ??
                    "Not specified"
                  }
                />

                <InfoRow
                  label="Availability"
                  value={statusLabel}
                  last
                />

              </div>

            </section>


            {/* =================================================
                AVAILABILITY
            ================================================= */}

            <section className="mt-12 border-t border-black/10 pt-7">

              <div className="flex items-center gap-3">

                <span
                  className={`h-2 w-2 rounded-full ${
                    vehicle.status === "AVAILABLE"
                      ? "bg-black"
                      : "bg-black/25"
                  }`}
                />

                <p className="text-[9px] font-medium uppercase tracking-[0.22em]">
                  {statusLabel}
                </p>

              </div>

              <p className="mt-3 max-w-2xl text-xs leading-6 text-black/50">
                {statusMessage}
              </p>

            </section>

          </div>


          {/* =====================================================
              RIGHT SIDEBAR
          ===================================================== */}

          <aside
            id="enquiry"
            className="min-w-0 lg:sticky lg:top-[94px]"
          >

            <div className="space-y-5">


              {/* =================================================
                  ENQUIRY
              ================================================= */}

              {canEnquire && (

                <div className="border border-black/15 bg-white">

                  <div className="border-b border-black/10 px-6 py-7 md:px-7">

                    <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-black/45">
                      Private enquiry
                    </p>

                    <h2 className="mt-3 font-serif text-3xl tracking-[-0.035em]">
                      Make an enquiry.
                    </h2>

                    <p className="mt-3 text-xs leading-5 text-black/50">
                      Speak directly with the AA Kurmawa
                      team about this vehicle,
                      availability and inspection.
                    </p>

                  </div>


                  <div className="px-6 py-7 md:px-7">

                    <VehicleEnquiryForm
                      vehicleId={vehicle.id}
                      vehicleName={vehicleName}
                    />

                  </div>

                </div>

              )}


              {/* =================================================
                  APPOINTMENT
              ================================================= */}

              {canEnquire && (

                <AppointmentForm
                  vehicleId={vehicle.id}
                  vehicleName={vehicleName}
                />

              )}


              {/* =================================================
                  CONTACT ACTIONS
              ================================================= */}

              <div className="grid grid-cols-2 gap-2">

                {canEnquire && (

                  <a
                    href={`https://wa.me/2347077773521?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[58px] items-center justify-center gap-2 bg-black px-4 text-center text-[8px] font-semibold uppercase tracking-[0.17em] text-white transition-colors hover:bg-black/80"
                  >
                    WhatsApp

                    <ArrowUpRight
                      size={12}
                      strokeWidth={1.2}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />

                  </a>

                )}


                <a
                  href="tel:07077773521"
                  className="group flex min-h-[58px] items-center justify-center gap-2 border border-black/15 px-4 text-center text-[8px] font-semibold uppercase tracking-[0.17em] text-black transition-colors hover:border-black hover:bg-black hover:text-white"
                >

                  <Phone
                    size={12}
                    strokeWidth={1.2}
                  />

                  Call us

                </a>

              </div>

            </div>

          </aside>

        </div>

      </section>

        <ExperienceMarquee />

      {/* =========================================================
          RELATED VEHICLES
      ========================================================= */}

      {relatedVehicles.length > 0 && (

        <section className="bg-white px-5 py-20 md:px-8 md:py-28 lg:px-10">

          <div className="mx-auto max-w-[1600px]">

            <div className="flex items-end justify-between gap-8">

              <div>

                <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-black/40">
                  Continue exploring
                </p>

                <h2 className="mt-4 font-serif text-5xl tracking-[-0.045em] md:text-6xl">
                  Explore more.
                </h2>

              </div>


              <Link
                href="/vehicles"
                className="group hidden items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] sm:flex"
              >
                View collection

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.2}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

            </div>


            <div className="mt-12 grid gap-8 md:grid-cols-2">

              {relatedVehicles.map((item) => (

                <VehicleCard
                  key={item.id}
                  vehicle={item}
                />

              ))}

            </div>

          </div>

        </section>

      )}


    {/* ============================================================
    FINAL CTA
============================================================ */}

        <section className="border-t border-black bg-black text-white">
          <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 md:py-24 lg:px-10 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
              
              {/* Main message */}
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-white/45">
                  AA Kurmawa Automobiles
                </p>

                <h2 className="mt-6 max-w-[850px] font-serif text-[clamp(3.2rem,6vw,6.8rem)] leading-[0.86] tracking-[-0.055em] text-white">
                  Ready to make
                  <br />
                  it yours?
                </h2>
              </div>

              {/* Supporting content */}
              <div className="max-w-[420px] lg:pb-1">
                <p className="text-[15px] leading-7 text-white/65">
                  Speak with our team about this vehicle, arrange an inspection,
                  or request further information. We are here to make your next
                  move straightforward.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    href="#enquiry"
                    className="group inline-flex min-h-[52px] items-center justify-center gap-3 bg-white px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition-colors duration-300 hover:bg-white/90"
                  >
                    Start an enquiry

                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </a>

                  <a
                    href="tel:07077773521"
                    className="group inline-flex min-h-[52px] items-center justify-center gap-3 border border-white/25 px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                  >
                    Call us

                    <Phone
                      size={13}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom information strip */}
            <div className="mt-16 border-t border-white/15 pt-6 md:mt-20">
              <div className="grid gap-6 text-[9px] uppercase tracking-[0.2em] text-white/40 sm:grid-cols-3">
                <div>
                  <span className="block text-white/25">Showroom</span>
                  <span className="mt-2 block text-white/70">
                    Kano, Nigeria
                  </span>
                </div>

                <div>
                  <span className="block text-white/25">Telephone</span>
                  <span className="mt-2 block text-white/70">
                    0707 777 3521
                  </span>
                </div>

                <div>
                  <span className="block text-white/25">Experience</span>
                  <span className="mt-2 block text-white/70">
                    Inspection · Enquiry · Trade-In
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

    </main>

<SiteFooter />
</>

  );
}


/* =============================================================
   INFO CELL
============================================================= */

function InfoCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-black/10 px-5 py-6 last:border-r-0 sm:px-6 md:py-7">

      <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-black/70">
          {label}
        </p>

        <p className="mt-3 text-sm text-black">
          {value}
        </p>

    </div>
  );
}


/* =============================================================
   INFO ROW
============================================================= */

function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[0.8fr_1.2fr] gap-6 py-5 ${
        !last ? "border-b border-black/10" : ""
      }`}
    >

      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-black">
        {label}
      </p>

          <p className="text-sm font-medium text-black">
      {value}
    </p>

    </div>
  );
}


/* =============================================================
   HIGHLIGHT
============================================================= */

function Highlight({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex min-h-[96px] items-center gap-4 border-b border-black/10 px-5 last:border-b-0 sm:border-r sm:px-6 sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:[&:last-child]:border-r-0">

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/15 text-black">
        {icon}
      </span>

      <span className="text-xs text-black/65">
        {text}
      </span>

    </div>

  );
}