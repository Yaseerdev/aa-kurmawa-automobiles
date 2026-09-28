import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  BookOpen,
  Star,
} from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase-server";

type JournalPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  cover_image: string | null;
  published: boolean;
  featured: boolean;
  published_at: string | null;
  created_at: string;
};

export default async function AdminJournalPage() {
  const supabase = await createSupabaseServerClient();

  const { data: posts, error } = await supabase
    .from("journal_posts")
    .select(`
      id,
      title,
      slug,
      category,
      excerpt,
      cover_image,
      published,
      featured,
      published_at,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load journal posts:", error);
  }

  const postList = (posts ?? []) as JournalPost[];

  const publishedCount = postList.filter(
    (post) => post.published
  ).length;

  const featuredCount = postList.filter(
    (post) => post.featured
  ).length;

  const draftCount = postList.filter(
    (post) => !post.published
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
              Journal
            </h1>
          </div>

          <Link
            href="/admin/journal/new"
            className="group flex items-center gap-3 bg-[#090b0d] px-5 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85"
          >
            <Plus size={14} strokeWidth={1.4} />
            New story
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-10 lg:px-10 lg:py-14">
        {/* Intro */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/35">
              Stories & insights
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
              Your journal.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-black/45">
              Create and manage the stories, insights and editorial content
              published across the AA Kurmawa digital showroom.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 border border-black/10 bg-white/30 px-4 py-3">
              <BookOpen
                size={15}
                strokeWidth={1.3}
                className="text-black/35"
              />

              <span className="text-[9px] uppercase tracking-[0.2em] text-black/45">
                {postList.length}{" "}
                {postList.length === 1 ? "story" : "stories"}
              </span>
            </div>

            <div className="flex items-center gap-3 border border-black/10 bg-white/30 px-4 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-black/35" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-black/45">
                {publishedCount} published
              </span>
            </div>

            <div className="flex items-center gap-3 border border-black/10 bg-white/30 px-4 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-black/20" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-black/45">
                {draftCount} drafts
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

        {/* Empty state */}
        {postList.length === 0 ? (
          <div className="mt-12 border border-black/10 bg-white/20 px-6 py-20 text-center">
            <BookOpen
              size={24}
              strokeWidth={1.2}
              className="mx-auto text-black/25"
            />

            <h3 className="mt-5 font-serif text-2xl">
              No stories yet.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/40">
              Create your first journal story to begin building the AA Kurmawa
              editorial collection.
            </p>

            <Link
              href="/admin/journal/new"
              className="mt-7 inline-flex items-center gap-3 bg-[#090b0d] px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-white"
            >
              <Plus size={13} strokeWidth={1.4} />
              Create first story
            </Link>
          </div>
        ) : (
          <div className="mt-12 overflow-hidden border border-black/10">
            {/* Table header */}
            <div className="hidden grid-cols-[2fr_1fr_0.9fr_0.8fr_0.8fr_40px] gap-6 border-b border-black/10 bg-black/[0.02] px-6 py-3 lg:grid">
              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Story
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Category
              </span>

              <span className="text-[8px] uppercase tracking-[0.2em] text-black/35">
                Published
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
            {postList.map((post) => (
              <Link
                key={post.id}
                href={`/admin/journal/${post.id}`}
                className="group grid gap-5 border-b border-black/10 px-6 py-6 transition-colors last:border-b-0 hover:bg-white/40 lg:grid-cols-[2fr_1fr_0.9fr_0.8fr_0.8fr_40px] lg:items-center lg:gap-6"
              >
                {/* Story */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {post.featured && (
                      <span className="inline-flex items-center gap-1 text-[7px] uppercase tracking-[0.16em] text-black/35">
                        <Star size={9} strokeWidth={1.4} />
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 font-serif text-xl tracking-[-0.02em]">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="mt-2 line-clamp-1 max-w-xl text-xs leading-5 text-black/35">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Category
                  </p>

                  <p className="text-xs text-black/55">
                    {post.category || "—"}
                  </p>
                </div>

                {/* Published date */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Published
                  </p>

                  <p className="text-xs text-black/55">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Status
                  </p>

                  <span
                    className={`inline-flex border px-2.5 py-1 text-[8px] uppercase tracking-[0.14em] ${
                      post.published
                        ? "border-emerald-900/10 bg-emerald-50 text-emerald-800"
                        : "border-black/10 bg-black/5 text-black/40"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Featured */}
                <div>
                  <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/30 lg:hidden">
                    Featured
                  </p>

                  <span className="text-[9px] uppercase tracking-[0.14em] text-black/45">
                    {post.featured ? "Yes" : "No"}
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