import Link from "next/link";
import { ArrowLeft, Trash2, ExternalLink } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

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
  updated_at: string;
};

async function getService(id: string): Promise<Service | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("services")
    .select(
      `
        id,
        title,
        slug,
        description,
        category,
        icon,
        cta_label,
        cta_url,
        sort_order,
        published,
        featured,
        created_at,
        updated_at
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load service:", error);
    return null;
  }

  return data as Service | null;
}

async function updateService(
  id: string,
  formData: FormData
) {
  "use server";

  const supabase = await createSupabaseServerClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
  const category = String(
    formData.get("category") ?? ""
  ).trim();
  const icon = String(
    formData.get("icon") ?? ""
  ).trim();
  const ctaLabel = String(
    formData.get("cta_label") ?? ""
  ).trim();
  const ctaUrl = String(
    formData.get("cta_url") ?? ""
  ).trim();

  const sortOrder = Number(
    formData.get("sort_order") ?? 0
  );

  const published =
    formData.get("published") === "on";

  const featured =
    formData.get("featured") === "on";

  if (!title) {
    throw new Error("Service title is required.");
  }

  const { error } = await supabase
    .from("services")
    .update({
      title,
      description: description || null,
      category: category || null,
      icon: icon || null,
      cta_label: ctaLabel || null,
      cta_url: ctaUrl || null,
      sort_order: Number.isFinite(sortOrder)
        ? sortOrder
        : 0,
      published,
      featured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update service:", error);
    throw new Error(error.message);
  }

  redirect(`/admin/services/${id}`);
}

async function deleteService(id: string) {
  "use server";

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete service:", error);
    throw new Error(error.message);
  }

  redirect("/admin/services");
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f4f2ed]">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="flex min-h-20 items-center gap-5 px-6 lg:px-10">
          <Link
            href="/admin/services"
            className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/40 transition-colors hover:bg-black hover:text-white"
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.3}
            />
          </Link>

          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Services
            </p>

            <h1 className="mt-1 font-serif text-2xl tracking-[-0.025em]">
              Edit service
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-10 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-4xl">

          {/* Intro */}
          <div className="mb-10">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              Service
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
              {service.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-[8px] uppercase tracking-[0.18em] text-black/35">
                /{service.slug}
              </span>

              <span
                className={`border px-2.5 py-1 text-[8px] uppercase tracking-[0.14em] ${
                  service.published
                    ? "border-emerald-900/10 bg-emerald-50 text-emerald-800"
                    : "border-black/10 bg-black/5 text-black/40"
                }`}
              >
                {service.published
                  ? "Published"
                  : "Hidden"}
              </span>

              {service.featured && (
                <span className="border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[8px] uppercase tracking-[0.14em] text-black/45">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Edit form */}
          <form
            action={updateService.bind(
              null,
              service.id
            )}
            className="space-y-8"
          >
            {/* Basic information */}
            <section className="border border-black/10 bg-white/20">
              <div className="border-b border-black/10 px-6 py-5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Basic information
                </p>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2">

                <Field
                  label="Service title"
                  name="title"
                  defaultValue={service.title}
                  required
                />

                <Field
                  label="Category"
                  name="category"
                  defaultValue={
                    service.category ?? ""
                  }
                  placeholder="Automotive"
                />

                <div className="md:col-span-2">
                  <label className="block text-[8px] uppercase tracking-[0.2em] text-black/40">
                    Description
                  </label>

                  <textarea
                    name="description"
                    rows={5}
                    defaultValue={
                      service.description ?? ""
                    }
                    placeholder="Describe this service..."
                    className="mt-3 w-full resize-none border border-black/10 bg-white/30 px-4 py-3 text-sm leading-6 outline-none transition focus:border-black/30"
                  />
                </div>

                <Field
                  label="Icon"
                  name="icon"
                  defaultValue={
                    service.icon ?? ""
                  }
                  placeholder="Car"
                />

                <Field
                  label="Display order"
                  name="sort_order"
                  type="number"
                  defaultValue={String(
                    service.sort_order
                  )}
                />
              </div>
            </section>

            {/* CTA */}
            <section className="border border-black/10 bg-white/20">
              <div className="border-b border-black/10 px-6 py-5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Call to action
                </p>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2">
                <Field
                  label="CTA label"
                  name="cta_label"
                  defaultValue={
                    service.cta_label ?? ""
                  }
                  placeholder="Learn more"
                />

                <Field
                  label="CTA URL"
                  name="cta_url"
                  defaultValue={
                    service.cta_url ?? ""
                  }
                  placeholder="/contact"
                />
              </div>
            </section>

            {/* Publishing */}
            <section className="border border-black/10 bg-white/20">
              <div className="border-b border-black/10 px-6 py-5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Publishing
                </p>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2">

                <label className="flex cursor-pointer items-center justify-between border border-black/10 bg-white/20 px-4 py-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em]">
                      Published
                    </p>

                    <p className="mt-1 text-[10px] text-black/40">
                      Show this service publicly.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={
                      service.published
                    }
                    className="h-4 w-4 accent-black"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between border border-black/10 bg-white/20 px-4 py-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em]">
                      Featured
                    </p>

                    <p className="mt-1 text-[10px] text-black/40">
                      Highlight this service.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={
                      service.featured
                    }
                    className="h-4 w-4 accent-black"
                  />
                </label>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">

              <button
                formAction={deleteService.bind(
                  null,
                  service.id
                )}
                type="submit"
                className="inline-flex w-fit items-center justify-center gap-2 border border-red-900/15 px-5 py-4 text-[9px] uppercase tracking-[0.18em] text-red-800 transition-colors hover:bg-red-50"
              >
                <Trash2
                  size={13}
                  strokeWidth={1.3}
                />
                Delete service
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                {service.cta_url && (
                  <a
                    href={service.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-black/10 px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:bg-black/5 hover:text-black"
                  >
                    Preview CTA
                    <ExternalLink
                      size={12}
                      strokeWidth={1.3}
                    />
                  </a>
                )}

                <Link
                  href="/admin/services"
                  className="inline-flex items-center justify-center border border-black/10 px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:bg-black/5 hover:text-black"
                >
                  Cancel
                </Link>

               <AdminSubmitButton
                  label="Save changes"
                  pendingLabel="Saving changes..."
                  className="bg-[#090b0d] px-7 py-4 text-[9px] uppercase tracking-[0.2em] text-white hover:opacity-85"
                />
              </div>
            </div>
          </form>

          {/* Metadata */}
          <div className="mt-10 border-t border-black/10 pt-5">
            <div className="flex flex-col gap-2 text-[8px] uppercase tracking-[0.15em] text-black/30 sm:flex-row sm:justify-between">
              <span>
                Service ID · {service.id}
              </span>

              <span>
                Created ·{" "}
                {new Intl.DateTimeFormat(
                  "en-NG",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                ).format(
                  new Date(service.created_at)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-[8px] uppercase tracking-[0.2em] text-black/40">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="mt-3 w-full border border-black/10 bg-white/30 px-4 py-3 text-sm outline-none transition focus:border-black/30"
      />
    </div>
  );
}