import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import JournalCoverUploader from "@/components/admin/JournalCoverUploader";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createJournalPost(formData: FormData) {
  "use server";

  const supabase = await createSupabaseServerClient();

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const category = String(
    formData.get("category") ?? "AUTOMOTIVE"
  ).trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(
    formData.get("cover_image") ?? ""
  ).trim();

  const published =
    formData.get("published") === "on";

  const featured =
    formData.get("featured") === "on";

  const publishedAtInput = String(
    formData.get("published_at") ?? ""
  ).trim();

  if (!title) {
    throw new Error("Journal title is required.");
  }

  if (!content) {
    throw new Error("Journal content is required.");
  }

  const slug = createSlug(slugInput || title);

  if (!slug) {
    throw new Error("A valid journal slug is required.");
  }

  let publishedAt: string | null = null;

  if (published) {
    publishedAt = publishedAtInput
      ? new Date(publishedAtInput).toISOString()
      : new Date().toISOString();
  }

  const { error } = await supabase
    .from("journal_posts")
    .insert({
      title,
      slug,
      category: category || "AUTOMOTIVE",
      excerpt: excerpt || null,
      content,
      cover_image: coverImage || null,
      published,
      featured,
      published_at: publishedAt,
    });

  if (error) {
    console.error(
      "Failed to create journal post:",
      error
    );

    if (error.code === "23505") {
      throw new Error(
        "A journal story with this slug already exists. Change the slug and try again."
      );
    }

    throw new Error(error.message);
  }

  const { redirect } = await import("next/navigation");

  redirect("/admin/journal");
}

export default function NewJournalPage() {
  return (
    <main className="min-h-screen bg-[#f4f2ed]">
      <header className="border-b border-black/10">
        <div className="flex min-h-20 items-center gap-5 px-6 lg:px-10">
          <Link
            href="/admin/journal"
            className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/40 transition-colors hover:bg-black hover:text-white"
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.3}
            />
          </Link>

          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Journal
            </p>

            <h1 className="mt-1 font-serif text-2xl tracking-[-0.025em]">
              New story
            </h1>
          </div>
        </div>
      </header>

      <div className="px-6 py-10 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              Editorial
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
              Tell a story.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-black/45">
              Create a story, insight or perspective for the
              AA Kurmawa Journal.
            </p>
          </div>

          <form
            action={createJournalPost}
            className="space-y-8"
          >
            {/* BASIC INFORMATION */}
            <section className="border border-black/10 bg-white/20">
              <div className="border-b border-black/10 px-6 py-5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Basic information
                </p>
              </div>

              <div className="grid gap-6 p-6">
                <Field
                  label="Story title"
                  name="title"
                  placeholder="The Art of Choosing the Right Vehicle"
                  required
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <Field
                    label="Slug"
                    name="slug"
                    placeholder="the-art-of-choosing-the-right-vehicle"
                  />

                  <Field
                    label="Category"
                    name="category"
                    placeholder="AUTOMOTIVE"
                    defaultValue="AUTOMOTIVE"
                  />
                </div>

                <div>
                  <label className="block text-[8px] uppercase tracking-[0.2em] text-black/40">
                    Excerpt
                  </label>

                  <textarea
                    name="excerpt"
                    rows={4}
                    placeholder="A short introduction that appears on journal listings and featured story sections..."
                    className="mt-3 w-full resize-none border border-black/10 bg-white/30 px-4 py-3 text-sm leading-6 outline-none transition focus:border-black/30"
                  />

                  <p className="mt-2 text-[9px] text-black/30">
                    Keep this short. It is the editorial preview
                    shown before someone opens the story.
                  </p>
                </div>
              </div>
            </section>

            {/* COVER IMAGE */}
            <section className="border border-black/10 bg-white/20">
              <div className="border-b border-black/10 px-6 py-5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Editorial image
                </p>
              </div>

              <div className="p-6">
                <JournalCoverUploader />
              </div>
            </section>

            {/* CONTENT */}
            <section className="border border-black/10 bg-white/20">
              <div className="border-b border-black/10 px-6 py-5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Story
                </p>
              </div>

              <div className="p-6">
                <label className="block text-[8px] uppercase tracking-[0.2em] text-black/40">
                  Content
                </label>

                <textarea
                  name="content"
                  rows={18}
                  required
                  placeholder={`Write the story here...

Start with the idea.
Build the story naturally.
Give the reader something useful to take away.`}
                  className="mt-3 w-full resize-y border border-black/10 bg-white/30 px-4 py-4 text-sm leading-7 outline-none transition focus:border-black/30"
                />

                <p className="mt-3 text-[9px] leading-5 text-black/30">
                  Write in simple paragraphs. The public article
                  page will handle the typography and spacing.
                </p>
              </div>
            </section>

            {/* PUBLISHING */}
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
                      Make this story visible publicly.
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
                      Highlight this story on the website.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="featured"
                    className="h-4 w-4 accent-black"
                  />
                </label>
              </div>

              <div className="border-t border-black/10 p-6">
                <div className="max-w-md">
                  <label className="block text-[8px] uppercase tracking-[0.2em] text-black/40">
                    Publication date
                  </label>

                  <input
                    type="datetime-local"
                    name="published_at"
                    defaultValue={getDefaultDateTime()}
                    className="mt-3 w-full border border-black/10 bg-white/30 px-4 py-3 text-sm outline-none transition focus:border-black/30"
                  />

                  <p className="mt-2 text-[9px] leading-5 text-black/30">
                    Leave this unchanged to publish the story
                    immediately when published.
                  </p>
                </div>
              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/admin/journal"
                className="inline-flex items-center justify-center border border-black/10 px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:bg-black/5 hover:text-black"
              >
                Cancel
              </Link>

              <AdminSubmitButton
                label="Publish story"
                pendingLabel="Publishing story..."
                className="bg-[#090b0d] px-7 py-4 text-[9px] uppercase tracking-[0.2em] text-white hover:opacity-85"
              />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function getDefaultDateTime() {
  const date = new Date();

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
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