import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import {
  getPublishedJournalPostBySlug,
  getPublishedJournalPosts,
} from "@/lib/queries/journal";

type JournalDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await getPublishedJournalPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function JournalDetailPage({
  params,
}: JournalDetailPageProps) {
  const { slug } = await params;

  const post = await getPublishedJournalPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = (post.content ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const formattedDate = post.published_at
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(post.published_at))
    : null;

  return (
    <>
      <main className="min-h-screen bg-[#eeece7] text-black">
        <section className="relative bg-[#050505] text-white">
          <Navbar />

          <div className="mx-auto max-w-[1600px] px-5 pb-16 pt-32 sm:px-8 md:px-10 md:pb-20 lg:px-14 lg:pt-40">
            <Reveal>
              <Link
                href="/journal"
                className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.24em] text-white/45 transition-colors hover:text-white"
              >
                <ArrowLeft
                  size={13}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />

                Journal
              </Link>
            </Reveal>

            <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
              <Reveal>
                <div>
                  <div className="flex items-center gap-4">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-white/45">
                      {post.category}
                    </span>

                    {formattedDate && (
                      <>
                        <span className="h-px w-8 bg-white/20" />

                        <span className="text-[8px] uppercase tracking-[0.3em] text-white/35">
                          {formattedDate}
                        </span>
                      </>
                    )}
                  </div>

                  <h1 className="mt-8 max-w-6xl font-serif text-[clamp(4rem,8vw,8.5rem)] leading-[0.8] tracking-[-0.06em]">
                    {post.title}
                  </h1>
                </div>
              </Reveal>

              {post.excerpt && (
                <Reveal delay={0.12}>
                  <p className="max-w-md text-sm leading-7 text-white/55 md:text-base">
                    {post.excerpt}
                  </p>
                </Reveal>
              )}
            </div>
          </div>
        </section>

        {post.cover_image && (
          <section>
            <div className="mx-auto max-w-[1600px] px-5 pt-5 sm:px-8 md:px-10 lg:px-14">
              <Reveal>
                <div className="relative aspect-[16/8] overflow-hidden bg-black/5">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    priority
                    unoptimized
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </section>
        )}

        <section>
          <div className="mx-auto max-w-[1100px] px-5 py-20 sm:px-8 md:py-28 lg:py-36">
            <div className="grid gap-12 md:grid-cols-[140px_1fr] md:gap-16">
              <Reveal>
                <div className="border-t border-black/15 pt-4">
                  <p className="text-[8px] uppercase tracking-[0.28em] text-black/35">
                    AA Kurmawa
                  </p>

                  <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-black/30">
                    Journal
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <article className="max-w-3xl">
                  {paragraphs.length > 0 ? (
                    <div className="space-y-8">
                      {paragraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className={
                            index === 0
                              ? "font-serif text-2xl leading-[1.25] tracking-[-0.025em] md:text-3xl"
                              : "text-base leading-8 text-black/65"
                          }
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-7 text-black/45">
                      This story does not have any published content yet.
                    </p>
                  )}
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-black text-white">
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 md:px-10 md:py-28 lg:px-14">
            <Reveal>
              <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-white/35">
                    Continue exploring
                  </p>

                  <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[0.9] tracking-[-0.04em] md:text-6xl">
                    More from the
                    <br />
                    AA Kurmawa Journal.
                  </h2>
                </div>

                <Link
                  href="/journal"
                  className="group inline-flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.22em]"
                >
                  View all stories

                  <span className="flex h-9 w-9 items-center justify-center border border-white/20 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.2}
                    />
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}