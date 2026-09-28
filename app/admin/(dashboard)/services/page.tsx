import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  Wrench,
  Star,
} from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase-server";

type Service = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  cta_label: string | null;
  cta_url: string | null;
  sort_order: number;
  published: boolean;
  featured: boolean;
  created_at: string;
};

export default async function AdminServicesPage() {
  const supabase = await createSupabaseServerClient();

  const { data: services, error } = await supabase
  .from("services")
  .select(`
    id,
    title,
    slug,
    description,
    category,
    sort_order,
    published,
    featured,
    created_at
  `)
  .order("sort_order", { ascending: true })
  .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load services:", error);
  }

  const serviceList = (services ?? []) as Service[];

  const publishedCount = serviceList.filter(
    (service) => service.published
  ).length;

  const featuredCount = serviceList.filter(
    (service) => service.featured
  ).length;

  return (
    <main className="min-h-screen bg-[#f4f2ed]">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="flex min-h-20 items-center justify-between gap-6 px-6 lg:px-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Content
            </p>

            <h1 className="mt-1 font-serif text-2xl tracking-[-0.025em]">
              Services
            </h1>
          </div>

          <Link
            href="/admin/services/new"
            className="group flex items-center gap-3 bg-[#090b0d] px-5 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85"
          >
            <Plus size={14} strokeWidth={1.4} />
            Add service
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-10 lg:px-10 lg:py-14">
        {/* Intro */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              What we do
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
              Your services.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-black/45">
              Manage the services displayed across the AA Kurmawa digital
              showroom.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 border border-black/10 bg-white/30 px-4 py-3">
              <Wrench
                size={15}
                strokeWidth={1.3}
                className="text-black/35"
              />

              <span className="text-[9px] uppercase tracking-[0.2em] text-black/45">
                {serviceList.length}{" "}
                {serviceList.length === 1 ? "service" : "services"}
              </span>
            </div>

            <div className="flex items-center gap-3 border border-black/10 bg-white/30 px-4 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-black/35" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-black/45">
                {publishedCount} published
              </span>
            </div>

            <div className="flex items-center gap-3 border border-black/10 bg-white/30 px-4 py-3">
              <Star
                size={14}
                strokeWidth={1.3}
                className="text-black/35"
              />

              <span className="text-[9px] uppercase tracking-[0.2em] text-black/45">
                {featuredCount} featured
              </span>
            </div>
          </div>
        </div>

        {/* Services */}
        {serviceList.length === 0 ? (
          <div className="mt-12 border border-black/10 bg-white/20 px-6 py-20 text-center">
            <Wrench
              size={24}
              strokeWidth={1.2}
              className="mx-auto text-black/25"
            />

            <h3 className="mt-5 font-serif text-2xl">
              No services yet.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/40">
              Add your first service to begin building the AA Kurmawa
              services collection.
            </p>

            <Link
              href="/admin/services/new"
              className="mt-7 inline-flex items-center gap-3 bg-[#090b0d] px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-white"
            >
              <Plus size={13} strokeWidth={1.4} />
              Add first service
            </Link>
          </div>
        ) : (
          <div className="mt-12 overflow-hidden border border-black/10">
            {/* Table header */}
            <div className="hidden grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr_40px] gap-6 border-b border-black/10 bg-black/[0.02] px-6 py-3 lg:grid">
              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Service
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Category
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Order
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Status
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Featured
              </span>

              <span />
            </div>

            {/* Rows */}
            {serviceList.map((service) => (
              <Link
                key={service.id}
                href={`/admin/services/${service.id}`}
                className="group grid gap-5 border-b border-black/10 px-6 py-6 transition-colors last:border-b-0 hover:bg-white/40 lg:grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr_40px] lg:items-center lg:gap-6"
              >
                {/* Service */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {service.featured && (
                      <span className="inline-flex items-center gap-1 text-[7px] uppercase tracking-[0.16em] text-black/35">
                        <Star size={9} strokeWidth={1.4} />
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 font-serif text-xl tracking-[-0.02em]">
                    {service.title}
                  </h3>

                  {service.description && (
                    <p className="mt-2 line-clamp-1 max-w-xl text-xs leading-5 text-black/35">
                      {service.description}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Category
                  </p>

                  <p className="text-xs text-black/55">
                    {service.category || "—"}
                  </p>
                </div>

                {/* Order */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Order
                  </p>

                  <p className="text-xs text-black/55">
                    {service.sort_order}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Status
                  </p>

                  <span
                    className={`inline-flex border px-2.5 py-1 text-[8px] uppercase tracking-[0.14em] ${
                      service.published
                        ? "border-emerald-900/10 bg-emerald-50 text-emerald-800"
                        : "border-black/10 bg-black/5 text-black/40"
                    }`}
                  >
                    {service.published ? "Published" : "Hidden"}
                  </span>
                </div>

                {/* Featured */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Featured
                  </p>

                  <span className="text-[9px] uppercase tracking-[0.14em] text-black/45">
                    {service.featured ? "Yes" : "No"}
                  </span>
                </div>

                {/* Arrow */}
                <div className="hidden justify-end lg:flex">
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.3}
                    className="text-black/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}