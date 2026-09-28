import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { getPublishedJournalPosts } from "@/lib/queries/journal";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const posts = await getPublishedJournalPosts();

  return (
    <>
      <main className="min-h-screen bg-[#eeece7] text-black">
        <section className="relative overflow-hidden bg-[#050505] text-white">
          <Navbar />

          <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-32 sm:px-8 md:px-10 md:pb-28 lg:px-14 lg:pb-32 lg:pt-40">
            <Reveal>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/45">
                AA Kurmawa · 07 — Journal
              </p>
            </Reveal>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <Reveal>
                <h1 className="max-w-6xl font-serif text-[clamp(4.5rem,10vw,10rem)] leading-[0.78] tracking-[-0.06em]">
                  Stories
                  <br />
                  worth
                  <br />
                  reading.
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="max-w-md lg:pb-2">
                  <p className="text-sm leading-7 text-white/55 md:text-base">
                    Perspectives on automobiles, ownership, the showroom
                    experience and the people behind AA Kurmawa.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="mt-20 flex items-center justify-between border-t border-white/15 pt-5">
              <span className="text-[8px] uppercase tracking-[0.28em] text-white/35">
                {posts.length} {posts.length === 1 ? "story" : "stories"}
              </span>

              <span className="text-[8px] uppercase tracking-[0.28em] text-white/35">
                Kano · Nigeria
              </span>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 md:px-10 md:py-28 lg:px-14">
            {posts.length === 0 ? (
              <div className="border-y border-black/10 py-32 text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-black/35">
                  Journal
                </p>

                <h2 className="mt-5 font-serif text-4xl tracking-[-0.04em]">
                  Stories coming soon.
                </h2>
              </div>
            ) : (
              <div className="space-y-0">
                {posts.map((post, index) => (
                  <Reveal key={post.id} delay={index * 0.05}>
                    <Link
                      href={`/journal/${post.slug}`}
                      className="group grid gap-8 border-t border-black/10 py-10 md:grid-cols-[90px_0.9fr_1.1fr] md:items-center md:gap-12 md:py-14"
                    >
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.28em] text-black/30">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                        {post.cover_image ? (
                          <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#ddd9d2]">
                            <span className="text-[8px] uppercase tracking-[0.3em] text-black/30">
                              AA Kurmawa Journal
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-4">
                          <span className="text-[8px] uppercase tracking-[0.28em] text-black/40">
                            {post.category}
                          </span>

                          <span className="h-px w-8 bg-black/15" />
                        </div>

                        <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[0.92] tracking-[-0.04em] md:text-5xl lg:text-6xl">
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="mt-6 max-w-xl text-sm leading-7 text-black/50">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="mt-8 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.22em]">
                          Read story

                          <span className="flex h-8 w-8 items-center justify-center border border-black/20 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                            <ArrowUpRight
                              size={13}
                              strokeWidth={1.2}
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}

                <div className="border-t border-black/10" />
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}