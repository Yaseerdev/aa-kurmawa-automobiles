import Link from "next/link";
import { ArrowLeft, Trash2, ExternalLink } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import SiteImageUploader from "@/components/admin/SiteImageUploader";

type JournalPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published: boolean;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

async function getJournalPost(
  id: string
): Promise<JournalPost | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("journal_posts")
    .select(
      `
        id,
        title,
        slug,
        category,
        excerpt,
        content,
        cover_image,
        published,
        featured,
        published_at,
        created_at,
        updated_at
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load journal post:", error);
    return null;
  }

  return data as JournalPost | null;
}

function formatDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function updateJournalPost(
  id: string,
  formData: FormData
) {
  "use server";

  const supabase = await createSupabaseServerClient();

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(
    formData.get("cover_image") ?? ""
  ).trim();

  const published =
    formData.get("published") === "on";

  const featured =
    formData.get("featured") === "on";

  const publishedAtValue = String(
    formData.get("published_at") ?? ""
  ).trim();

  if (!title) {
    throw new Error("Story title is required.");
  }

  if (!content) {
    throw new Error("Story content is required.");
  }

  let publishedAt: string | null = null;

  if (publishedAtValue) {
    const date = new Date(publishedAtValue);

    if (!Number.isNaN(date.getTime())) {
      publishedAt = date.toISOString();
    }
  } else if (published) {
    publishedAt = new Date().toISOString();
  }

  const { error } = await supabase
    .from("journal_posts")
    .update({
      title,
      category: category || "AUTOMOTIVE",
      excerpt: excerpt || null,
      content,
      cover_image: coverImage || null,
      published,
      featured,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Failed to update journal post:",
      error
    );

    throw new Error(error.message);
  }

  redirect(`/admin/journal/${id}`);
}

async function deleteJournalPost(id: string) {
  "use server";

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("journal_posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Failed to delete journal post:",
      error
    );

    throw new Error(error.message);
  }

  redirect("/admin/journal");
}

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await getJournalPost(id);

  if (!post) {
    notFound();
  }

  const publishedDate = formatDateTimeLocal(
    post.published_at
  );

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
              Edit story
            </h1>
          </div>
        </div>
      </header>

      <div className="px-6 py-10 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-5xl">

          {/* INTRO */}
          <div className="mb-10">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              Story
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
              {post.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-[8px] uppercase tracking-[0.18em] text-black/35">
                /{post.slug}
              </span>

              <span
                className={`border px-2.5 py-1 text-[8px] uppercase tracking-[0.14em] ${
                  post.published
                    ? "border-emerald-900/10 bg-emerald-50 text-emerald-800"
                    : "border-black/10 bg-black/5 text-black/40"
                }`}
              >
                {post.published
                  ? "Published"
                  : "Draft"}
              </span>

              {post.featured && (
                <span className="border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[8px] uppercase tracking-[0.14em] text-black/45">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* EDIT FORM */}
          <form
            action={updateJournalPost.bind(
              null,
              post.id
            )}
            className="space-y-8"
          >

            {/* STORY INFORMATION */}
            <section className="border border-black/10 bg-white/20">
              <div className="border-b border-black/10 px-6 py-5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Story information
                </p>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2">

                <div className="md:col-span-2">
                  <Field
                    label="Story title"
                    name="title"
                    defaultValue={post.title}
                    required
                  />

                  <p className="mt-2 text-[10px] leading-5 text-black/35">
                    The existing URL remains unchanged when
                    editing the title.
                  </p>
                </div>

                <div>
                  <label className="block text-[8px] uppercase tracking-[0.2em] text-black/40">
                    Category
                  </label>

                  <select
                    name="category"
                    defaultValue={
                      post.category || "AUTOMOTIVE"
                    }
                    className="mt-3 w-full appearance-none border border-black/10 bg-white/30 px-4 py-3 text-sm outline-none transition focus:border-black/30"
                  >
                    <option value="AUTOMOTIVE">
                      Automotive
                    </option>

                    <option value="OWNERSHIP">
                      Ownership
                    </option>

                    <option value="AA KURMAWA">
                      AA Kurmawa
                    </option>

                    <option value="BUSINESS">
                      Business
                    </option>

                    <option value="LIFESTYLE">
                      Lifestyle
                    </option>
                  </select>
                </div>

                <Field
                  label="Publication date"
                  name="published_at"
                  type="datetime-local"
                  defaultValue={publishedDate}
                />

                <div className="md:col-span-2">
                  <label className="block text-[8px] uppercase tracking-[0.2em] text-black/40">
                    Excerpt
                  </label>

                  <textarea
                    name="excerpt"
                    rows={4}
                    defaultValue={post.excerpt ?? ""}
                    placeholder="A short introduction that appears on the Journal and homepage."
                    className="mt-3 w-full resize-none border border-black/10 bg-white/30 px-4 py-3 text-sm leading-6 outline-none transition focus:border-black/30"
                  />

                  <p className="mt-2 text-[10px] text-black/35">
                    Keep this concise and editorial.
                  </p>
                </div>
              </div>
            </section>

            {/* COVER IMAGE */}
            <section className="border border-black/10 bg-white/20">
              <div className="border-b border-black/10 px-6 py-5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Cover image
                </p>
              </div>

              <div className="p-6">
                <SiteImageUploader
                  label="Journal cover"
                  description="Use a high-quality editorial image. JPG, PNG or WebP up to 8MB."
                  fieldName="cover_image"
                  initialUrl={post.cover_image ?? ""}
                  filePrefix={`journal-${post.id}`}
                  aspectClass="aspect-[16/10]"
                />
              </div>
            </section>

            {/* CONTENT */}
            <section className="border border-black/10 bg-white/20">
              <div className="border-b border-black/10 px-6 py-5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                  Story content
                </p>
              </div>

              <div className="p-6">
                <label className="block text-[8px] uppercase tracking-[0.2em] text-black/40">
                  Content
                </label>

                <textarea
                  name="content"
                  rows={20}
                  required
                  defaultValue={post.content ?? ""}
                  placeholder="Write your story here..."
                  className="mt-3 w-full resize-y border border-black/10 bg-white/30 px-5 py-4 text-sm leading-7 outline-none transition focus:border-black/30"
                />

                <div className="mt-3 flex flex-col gap-1 text-[10px] leading-5 text-black/35 sm:flex-row sm:justify-between">
                  <span>
                    Write naturally. The public Journal will
                    handle the presentation.
                  </span>

                  <span>
                    Plain editorial text
                  </span>
                </div>
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

                    <p className="mt-1 text-[10px] leading-5 text-black/40">
                      Make this story visible on the
                      public website.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={
                      post.published
                    }
                    className="h-4 w-4 accent-black"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between border border-black/10 bg-white/20 px-4 py-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em]">
                      Featured
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-black/40">
                      Highlight this story on the
                      homepage.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={
                      post.featured
                    }
                    className="h-4 w-4 accent-black"
                  />
                </label>

              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">

              <button
                formAction={deleteJournalPost.bind(
                  null,
                  post.id
                )}
                type="submit"
                className="inline-flex w-fit items-center justify-center gap-2 border border-red-900/15 px-5 py-4 text-[9px] uppercase tracking-[0.18em] text-red-800 transition-colors hover:bg-red-50"
              >
                <Trash2
                  size={13}
                  strokeWidth={1.3}
                />

                Delete story
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">

                <a
                  href={`/journal/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-black/10 px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:bg-black/5 hover:text-black"
                >
                  Preview story

                  <ExternalLink
                    size={12}
                    strokeWidth={1.3}
                  />
                </a>

                <Link
                  href="/admin/journal"
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

          {/* METADATA */}
          <div className="mt-10 border-t border-black/10 pt-5">
            <div className="flex flex-col gap-2 text-[8px] uppercase tracking-[0.15em] text-black/30 sm:flex-row sm:justify-between">
              <span>
                Story ID · {post.id}
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
                  new Date(post.created_at)
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