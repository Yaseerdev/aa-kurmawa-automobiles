import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  Phone,
} from "lucide-react";

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


const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://aakurmawa.com"
).replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getPublishedVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found",
      robots: { index: false, follow: false },
    };
  }

  const model = vehicle.model
  .toLowerCase()
  .startsWith(vehicle.brand.toLowerCase())
  ? vehicle.model
  : `${vehicle.brand} ${vehicle.model}`;

const vehicleName = `${vehicle.year} ${model}`;
  const title = `${vehicleName} for Sale in Kano`;
  const description =
    `Explore the ${vehicleName} at AA Kurmawa Automobiles in Kano, Nigeria. ` +
    `View vehicle details, specifications and availability, or arrange an inspection.`;

  const image = vehicle.images?.[0] || vehicle.image;
  const canonicalUrl = `${siteUrl}/vehicles/${vehicle.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "AA Kurmawa Automobiles",
      title,
      description,
      images: image
        ? [{ url: image, alt: vehicleName }]
        : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}


type PageProps = { 
  params: Promise<{
    slug: string;
  }>;
};

export default async function VehiclePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const vehicle = await getPublishedVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = await getRelatedVehicles(
    vehicle.id,
    2
  );

  const statusLabel = getVehicleStatusLabel(
    vehicle.status
  );

  const statusMessage = getVehicleStatusMessage(
    vehicle.status
  );

  const model = vehicle.model
  .toLowerCase()
  .startsWith(vehicle.brand.toLowerCase())
  ? vehicle.model
  : `${vehicle.brand} ${vehicle.model}`;

  const vehicleName = `${vehicle.year} ${model}`;

  const whatsappMessage = encodeURIComponent(
    `Hello AA Kurmawa Automobiles, I'm interested in the ${vehicleName}. Please provide more information.`
  );

  const canEnquire = vehicle.status === "AVAILABLE";

  return (
    <>
      <main className="min-h-screen bg-[#f4f2ee] text-[#090b0d]">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f4f2ee]/95 backdrop-blur-md">
          <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-5 px-5 md:h-[74px] md:px-10 lg:px-14">

            <Link
              href="/vehicles"
              className="group flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.2em] text-black/60 transition-colors hover:text-black"
            >
              <ArrowLeft
                size={14}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              Back to collection
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="/"
                className="text-[8px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:text-black"
              >
                Home
              </Link>

              <Link
                href="/vehicles"
                className="text-[8px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:text-black"
              >
                Current stock
              </Link>

              <span className="h-3 w-px bg-black/15" />

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                AA Kurmawa Automobiles
              </span>
            </div>

            <a
              href="#enquiry"
              className="group inline-flex items-center gap-3 bg-[#090b0d] px-4 py-3 text-[8px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity duration-300 hover:opacity-80 sm:px-5"
            >
              Enquire

              <ArrowUpRight
                size={12}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </header>


        {/* =====================================================
            INTRO / BREADCRUMB
        ====================================================== */}

        <section className="mx-auto max-w-[1600px] px-5 pt-7 md:px-10 md:pt-10 lg:px-14">
          <div className="flex flex-wrap items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-black/35">
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
              Collection
            </Link>

            <span>/</span>

            <span className="max-w-[220px] truncate text-black/55">
              {vehicleName}
            </span>
          </div>
        </section>


        {/* =====================================================
            VEHICLE PRESENTATION
        ====================================================== */}

        <section className="mx-auto max-w-[1600px] px-5 pb-24 pt-7 md:px-10 md:pb-32 md:pt-10 lg:px-14 lg:pb-40">

          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.5fr)] lg:gap-20 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.45fr)]">

            {/* =================================================
                LEFT — VEHICLE
            ================================================== */}

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
                  <div className="flex aspect-[16/10] items-center justify-center bg-[#deddd8]">
                    <span className="text-[8px] uppercase tracking-[0.24em] text-black/30">
                      Photography coming soon
                    </span>
                  </div>
                )}
              </div>


              
              {/* VEHICLE IDENTITY */}

              <section className="border-b border-black/10 py-12 md:py-16">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12 xl:gap-16">
                  {/* VEHICLE NAME */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="h-px w-8 shrink-0 bg-black/25" />

                      <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-black/45">
                        {vehicle.brand}
                      </p>
                    </div>

                    <h1 className="mt-6 max-w-full break-words font-serif text-[clamp(3.25rem,7.2vw,7.5rem)] leading-[0.84] tracking-[-0.065em]">
                      {vehicle.model}
                    </h1>

                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                      <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-black/50">
                        {vehicle.year}
                      </span>

                      <span className="h-3 w-px bg-black/15" />

                      <span className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.2em] text-black/60">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            vehicle.status === "AVAILABLE"
                              ? "bg-emerald-700"
                              : vehicle.status === "RESERVED"
                                ? "bg-amber-600"
                                : "bg-black/30"
                          }`}
                        />

                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  {/* ASKING PRICE */}
                  <div className="border-t border-black/15 pt-5 lg:min-w-[220px] lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:min-w-[250px] xl:pl-10">
                    <p className="text-[8px] font-medium uppercase tracking-[0.25em] text-black/40">
                      Asking price
                    </p>

                    <p className="mt-4 font-serif text-[clamp(1.9rem,3vw,2.75rem)] leading-none tracking-[-0.045em]">
                      {vehicle.price}
                    </p>

                    <p className="mt-3 text-[8px] uppercase tracking-[0.16em] text-black/35">
                      Subject to availability
                    </p>
                  </div>
                </div>

                {/* KEY SPECIFICATIONS */}
                <div className="mt-12 grid grid-cols-2 border-y border-black/10 sm:grid-cols-4">
                  <QuickSpec label="Mileage" value={vehicle.mileage} />
                  <QuickSpec label="Transmission" value={vehicle.transmission} />
                  <QuickSpec label="Fuel" value={vehicle.fuel} />
                  <QuickSpec label="Body" value={vehicle.body} />
                </div>
              </section>


             

              {/* =================================================
                  THE AUTOMOBILE
              ================================================== */}

              {vehicle.description && (
                <section className="border-b border-black/10 py-12 md:py-24">

                  <div className="grid gap-10 md:grid-cols-[0.45fr_1.55fr] md:gap-16">

                    <div>
                      <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-black/35">
                        01 — The automobile
                      </p>
                    </div>

                    <div>
                      <h2 className="max-w-3xl font-serif text-4xl leading-[0.92] tracking-[-0.045em] md:text-5xl lg:text-6xl">
                        Considered for
                        <br />
                        the right reasons.
                      </h2>

                      <p className="mt-6 max-w-2xl text-sm leading-8 text-black/50 md:mt-8 md:text-base">
                        {vehicle.description}
                      </p>
                    </div>

                  </div>

                </section>
              )}


              {/* =================================================
                  SPECIFICATION
              ================================================== */}

              <section className="py-12 md:py-24">

                <div className="grid gap-10 md:grid-cols-[0.45fr_1.55fr] md:gap-16">

                  <div>
                    <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-black/35">
                      02 — Specification
                    </p>

                    <h2 className="mt-5 font-serif text-3xl leading-none tracking-[-0.04em] md:text-4xl">
                      The details.
                    </h2>
                  </div>


                  <div className="border-t border-black/15">

                    <DetailRow
                      label="Year"
                      value={String(vehicle.year)}
                    />

                    <DetailRow
                      label="Mileage"
                      value={vehicle.mileage}
                    />

                    <DetailRow
                      label="Transmission"
                      value={vehicle.transmission}
                    />

                    <DetailRow
                      label="Fuel"
                      value={vehicle.fuel}
                    />

                    <DetailRow
                      label="Body style"
                      value={vehicle.body}
                    />

                    {vehicle.engine && (
                      <DetailRow
                        label="Engine"
                        value={vehicle.engine}
                      />
                    )}

                    {vehicle.drivetrain && (
                      <DetailRow
                        label="Drivetrain"
                        value={vehicle.drivetrain}
                      />
                    )}

                    {vehicle.exteriorColor && (
                      <DetailRow
                        label="Exterior"
                        value={vehicle.exteriorColor}
                      />
                    )}

                    {vehicle.interiorColor && (
                      <DetailRow
                        label="Interior"
                        value={vehicle.interiorColor}
                      />
                    )}

                    <DetailRow
                      label="Availability"
                      value={statusLabel}
                      last
                    />

                  </div>

                </div>

              </section>


              {/* =================================================
                  AVAILABILITY NOTE
              ================================================== */}

              <section className="border-t border-black/10 pt-7">

                <div className="flex items-center gap-3">

                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      vehicle.status === "AVAILABLE"
                        ? "bg-black"
                        : "bg-black/25"
                    }`}
                  />

                  <p className="text-[8px] font-medium uppercase tracking-[0.22em]">
                    {statusLabel}
                  </p>

                </div>

                <p className="mt-3 max-w-2xl text-xs leading-6 text-black/45">
                  {statusMessage}
                </p>

              </section>

            </div>

            {/* =================================================
                RIGHT — ENQUIRY
            ================================================== */}

            <aside
              id="enquiry"
              className="min-w-0 scroll-mt-24 lg:sticky lg:top-[100px] lg:self-start"
            >
              <div className="space-y-3">

                {/* =================================================
                    ENQUIRY
                ================================================== */}

                {canEnquire && (
                  <div className="overflow-hidden border border-black/15 bg-white">

                    {/* Header */}
                    <div className="border-b border-black/10 px-6 py-7 md:px-7 md:py-8">

                      <div className="flex items-center justify-between gap-4">

                        <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-black/40">
                          03 — Private enquiry
                        </p>

                        <span className="h-1.5 w-1.5 rounded-full bg-black" />

                      </div>

                      <h2 className="mt-5 max-w-xs font-serif text-[2rem] leading-[0.92] tracking-[-0.045em] md:text-[2.15rem]">
                        Make an enquiry.
                      </h2>

                      <p className="mt-4 max-w-sm text-xs leading-6 text-black/45">
                        Speak with our team about this vehicle, availability and
                        inspection.
                      </p>
                          
                    </div>

                    {/* Form */}
                    <div className="px-6 py-7 md:px-7 md:py-8">

                      <VehicleEnquiryForm
                        vehicleId={vehicle.id}
                        vehicleName={vehicleName}
                      />

                    </div>

                  </div>
                )}


                {/* =================================================
                    INSPECTION
                ================================================== */}

                {canEnquire && (
                  <div className="overflow-hidden border border-black/15 bg-white">

                    <AppointmentForm
                      vehicleId={vehicle.id}
                      vehicleName={vehicleName}
                    />

                  </div>
                )}


                {/* =================================================
                    DIRECT CONTACT
                ================================================== */}

                <div className="grid grid-cols-2 gap-2">

                  {canEnquire && (
                    <a
                      href={`https://wa.me/2347077773521?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-[58px] items-center justify-center gap-2 bg-[#090b0d] px-4 text-center text-[8px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-black/85"
                    >
                      WhatsApp

                      <ArrowUpRight
                        size={12}
                        strokeWidth={1.2}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  )}

                  <a
                    href="tel:07077773521"
                    className={`group flex min-h-[58px] items-center justify-center gap-2 border border-black/15 bg-transparent px-4 text-center text-[8px] font-semibold uppercase tracking-[0.18em] text-black transition-all duration-300 hover:border-black hover:bg-black hover:text-white ${
                      canEnquire ? "" : "col-span-2"
                    }`}
                  >
                    <Phone
                      size={12}
                      strokeWidth={1.2}
                    />

                    Call us
                  </a>

                </div>


                {/* =================================================
                    TRUST NOTE
                ================================================== */}

                <div className="border border-black/10 bg-transparent px-5 py-5">

                  <div className="flex items-start gap-3">

                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-black/35" />

                    <p className="text-[9px] leading-5 text-black/40">
                      Professional vehicle documentation, inspection support and
                      trade-in enquiries are available through our team.
                    </p>

                  </div>

                </div>

              </div>
            </aside>
                    
          </div>
        </section>


        {/* =====================================================
            EXPERIENCE MARQUEE
        ====================================================== */}

        <ExperienceMarquee />


        {/* =====================================================
            RELATED VEHICLES
        ====================================================== */}

        {relatedVehicles.length > 0 && (
          <section className="bg-[#f4f2ee] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">

            <div className="mx-auto max-w-[1600px]">

              <div className="grid gap-10 md:grid-cols-[0.5fr_1.5fr] md:gap-20">

                <div>
                  <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-black/35">
                    04 — Continue exploring
                  </p>
                </div>

                <div className="flex items-end justify-between gap-8">

                  <div>
                    <h2 className="font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-6xl lg:text-7xl">
                      Explore more.
                    </h2>

                    <p className="mt-6 max-w-lg text-sm leading-7 text-black/45">
                      Discover other vehicles currently available
                      through AA Kurmawa Automobiles.
                    </p>
                  </div>

                  <Link
                    href="/vehicles"
                    className="group hidden shrink-0 items-center gap-3 border-b border-black/15 pb-2 text-[8px] font-medium uppercase tracking-[0.2em] transition-colors hover:border-black sm:flex"
                  >
                    View collection

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.1}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>

                </div>

              </div>


              <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-8 lg:gap-12">
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


        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="bg-[#090b0d] text-white">

          <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">

            <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-24">

              <div>

                <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-white/35">
                  05 — AA Kurmawa Automobiles
                </p>

                <h2 className="mt-7 max-w-5xl font-serif text-[clamp(3.5rem,7vw,8rem)] leading-[0.8] tracking-[-0.065em]">
                  Ready to make
                  <br />
                  it yours?
                </h2>

              </div>


              <div className="max-w-lg lg:pb-2">

                <p className="text-sm leading-7 text-white/45 md:text-base md:leading-8">
                  Speak with our team about this vehicle,
                  arrange an inspection, or request further
                  information. We are here to make your next
                  move straightforward.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                  <a
                    href="#enquiry"
                    className="group inline-flex min-h-[54px] items-center justify-center gap-3 bg-white px-7 text-[9px] font-semibold uppercase tracking-[0.2em] text-black transition-opacity duration-300 hover:opacity-85"
                  >
                    Start an enquiry

                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.2}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>

                  <a
                    href="tel:07077773521"
                    className="group inline-flex min-h-[54px] items-center justify-center gap-3 border border-white/20 px-7 text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
                  >
                    Call us

                    <Phone
                      size={13}
                      strokeWidth={1.2}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </a>

                </div>

              </div>

            </div>


            <div className="mt-20 border-t border-white/10 pt-7 md:mt-28">

              <div className="grid gap-7 text-[8px] uppercase tracking-[0.2em] text-white/35 sm:grid-cols-3">

                <div>
                  <span className="block text-white/20">
                    Showroom
                  </span>

                  <span className="mt-2 block text-white/65">
                    Kano, Nigeria
                  </span>
                </div>

                <div>
                  <span className="block text-white/20">
                    Telephone
                  </span>

                  <span className="mt-2 block text-white/65">
                    0707 777 3521
                  </span>
                </div>

                <div>
                  <span className="block text-white/20">
                    Experience
                  </span>

                  <span className="mt-2 block text-white/65">
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
   QUICK SPEC
============================================================= */

function QuickSpec({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-black/10 px-3 py-4 last:border-r-0 sm:px-6 sm:py-6 md:py-7">
      <p className="text-[7px] font-medium uppercase tracking-[0.16em] text-black/35 sm:tracking-[0.2em]">
        {label}
      </p>

      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.02em] text-black/75 sm:mt-3 md:text-xs">
        {value}
      </p>
    </div>
  );
}




/* =============================================================
   DETAIL ROW
============================================================= */

function DetailRow({
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
      className={`grid grid-cols-[0.8fr_1.2fr] gap-4 py-4 sm:gap-6 sm:py-5 ${
        !last ? "border-b border-black/10" : ""
      }`}
    >
      <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-black/35 sm:tracking-[0.2em]">
        {label}
      </p>

      <p className="text-sm font-medium leading-6 text-black/80">
        {value}
      </p>
    </div>
  );
}
