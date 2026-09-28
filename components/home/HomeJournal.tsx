import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { getPublishedJournalPosts } from "@/lib/queries/journal";

export async function HomeJournal() {
  const posts = await getPublishedJournalPosts(3);

  return (
    <section
      id="journal"
      className="relative overflow-hidden bg-[#eeece7] text-black"
    >
      <div className="mx-auto max-w-[1600px] px-5 pt-24 pb-16 sm:px-8 md:px-10 md:pt-32 md:pb-20 lg:px-14 lg:pt-40 lg:pb-20">

        {/* Header */}
        <Reveal>
          <div className="border-t border-black/15 pt-5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-black/45">
                07 — Journal
              </p>

              <p className="hidden text-[9px] uppercase tracking-[0.28em] text-black/35 sm:block">
                AA Kurmawa Automobiles
              </p>
            </div>
          </div>
        </Reveal>

        {/* Intro */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
          <Reveal>
            <div>
              <p className="mb-7 text-[9px] font-medium uppercase tracking-[0.3em] text-black/45">
                Perspectives & stories
              </p>

              <h2 className="max-w-5xl font-serif text-[clamp(4rem,8vw,8.5rem)] leading-[0.82] tracking-[-0.055em]">
                The world
                <br />
                beyond
                <br />
                the vehicle.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="max-w-md lg:pb-2">
              <p className="text-sm leading-7 text-black/60 md:text-base">
                Discover stories, insights and perspectives from the world of
                automobiles, ownership and the AA Kurmawa experience.
              </p>

              <Link
                href="/journal"
                className="group mt-8 inline-flex items-center gap-4 border-b border-black/25 pb-2 text-[9px] font-semibold uppercase tracking-[0.22em] transition-colors hover:border-black"
              >
                Explore the journal

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Editorial cards */}
        {posts.length > 0 ? (
          <div className="mt-20 grid gap-px bg-black/10 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={index * 0.08}>
                <article className="group bg-[#eeece7]">
                  <Link
                    href={`/journal/${post.slug}`}
                    className="block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/5">

                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          unoptimized
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#dcd9d2]">
                          <div className="text-center">
                            <p className="text-[8px] uppercase tracking-[0.3em] text-black/30">
                              AA Kurmawa Journal
                            </p>
                            <p className="mt-3 font-serif text-3xl tracking-[-0.04em] text-black/25">
                              No image
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/0" />

                      <div className="absolute left-5 top-5">
                        <span className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/80">
                          {post.category}
                        </span>
                      </div>

                      <div className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center border border-white/40 bg-black/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-black">
                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.2}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                    </div>

                    <div className="border-t border-black/10 px-5 py-7 md:px-7 md:py-8">
                      <div className="flex items-start justify-between gap-8">
                        <span className="text-[8px] uppercase tracking-[0.25em] text-black/35">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="max-w-sm">
                          <h3 className="font-serif text-2xl leading-[0.95] tracking-[-0.025em] md:text-3xl">
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className="mt-5 text-xs leading-6 text-black/50">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="mt-20 border-t border-b border-black/10 py-20 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-black/35">
                The journal is being prepared.
              </p>

              <p className="mt-4 font-serif text-3xl tracking-[-0.03em]">
                Stories coming soon.
              </p>
            </div>
          </Reveal>
        )}

        {/* Bottom statement */}
        <Reveal delay={0.15}>
          <div className="mt-16 flex flex-col gap-6 border-t border-black/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.28em] text-black/35">
                Stories worth returning to.
              </p>

              <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-black/35">
                AA Kurmawa · Kano, Nigeria
              </p>
            </div>

            <Link
              href="/journal"
              className="group inline-flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.22em]"
            >
              View all stories

              <span className="flex h-8 w-8 items-center justify-center border border-black/20 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}