import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createService(formData: FormData) {
  "use server";

  const supabase = await createSupabaseServerClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const ctaLabel = String(formData.get("cta_label") ?? "").trim();
  const ctaUrl = String(formData.get("cta_url") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";

  if (!title) {
    throw new Error("Service title is required.");
  }

  const slug = createSlug(title);

  const { error } = await supabase.from("services").insert({
    title,
    slug,
    description: description || null,
    category: category || null,
    icon: icon || null,
    cta_label: ctaLabel || null,
    cta_url: ctaUrl || null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    published,
    featured,
  });

  if (error) {
    console.error("Failed to create service:", error);
    throw new Error(error.message);
  }

  // Redirect after successful creation.
  const { redirect } = await import("next/navigation");
  redirect("/admin/services");
}

export default function NewServicePage() {
  return (
    <main className="min-h-screen bg-[#f4f2ed]">
      <header className="border-b border-black/10">
        <div className="flex min-h-20 items-center gap-5 px-6 lg:px-10">
          <Link
            href="/admin/services"
            className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/40 transition-colors hover:bg-black hover:text-white"
          >
            <ArrowLeft size={15} strokeWidth={1.3} />
          </Link>

          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Services
            </p>

            <h1 className="mt-1 font-serif text-2xl tracking-[-0.025em]">
              Add service
            </h1>
          </div>
        </div>
      </header>

      <div className="px-6 py-10 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              New service
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
              Add something new.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-black/45">
              Create a service that can be displayed across the AA Kurmawa
              website.
            </p>
          </div>

          <form action={createService} className="space-y-8">
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
                  placeholder="Vehicle Sales"
                  required
                />

                <Field
                  label="Category"
                  name="category"
                  placeholder="Automotive"
                />

                <div className="md:col-span-2">
                  <label className="block text-[8px] uppercase tracking-[0.2em] text-black/40">
                    Description
                  </label>

                  <textarea
                    name="description"
                    rows={5}
                    placeholder="Describe this service..."
                    className="mt-3 w-full resize-none border border-black/10 bg-white/30 px-4 py-3 text-sm outline-none transition focus:border-black/30"
                  />
                </div>

                <Field
                  label="Icon"
                  name="icon"
                  placeholder="Car"
                />

                <Field
                  label="Display order"
                  name="sort_order"
                  type="number"
                  placeholder="1"
                  defaultValue="1"
                />
              </div>
            </section>

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
                  placeholder="Learn more"
                />

                <Field
                  label="CTA URL"
                  name="cta_url"
                  placeholder="/contact"
                />
              </div>
            </section>

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
                    defaultChecked
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
                    className="h-4 w-4 accent-black"
                  />
                </label>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/admin/services"
                className="inline-flex items-center justify-center border border-black/10 px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:bg-black/5 hover:text-black"
              >
                Cancel
              </Link>

              <AdminSubmitButton
                label="Create service"
                pendingLabel="Creating service..."
                className="bg-[#090b0d] px-7 py-4 text-[9px] uppercase tracking-[0.2em] text-white hover:opacity-85"
              />
            </div>
          </form>
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