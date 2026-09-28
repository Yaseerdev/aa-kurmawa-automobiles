import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";

type HomeService = {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  category?: string | null;
};

type HomeServicesProps = {
  services: HomeService[];
};

export function HomeServices({ services }: HomeServicesProps) {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#0b0c0d] text-white"
    >
      <div className="absolute inset-0 opacity-[0.035]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:py-28 md:px-10 lg:px-14 lg:py-36">
        {/* Header */}
        <div className="border-b border-white/10 pb-7">
          <div className="flex items-center justify-between gap-6">
            <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-white/40 md:text-[9px]">
              06 — Our Services
            </p>

            <p className="hidden text-[8px] uppercase tracking-[0.28em] text-white/25 sm:block">
              AA Kurmawa Automobiles
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
          <Reveal>
            <div>
              <p className="mb-7 text-[9px] font-medium uppercase tracking-[0.28em] text-white/40">
                Beyond the vehicle
              </p>

              <h2 className="max-w-5xl font-serif text-[clamp(3.5rem,8vw,8rem)] leading-[0.84] tracking-[-0.055em] text-white">
                Service that
                <br />
                stays with you.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-md lg:pb-2">
              <p className="text-sm leading-7 text-white/55 md:text-base">
                From finding the right vehicle to professional servicing,
                documentation, leasing and trade-in support, our services are
                designed around a clear and considered experience.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Services */}
        <div className="border-t border-white/10">
          {services.map((service, index) => {
            const description =
              service.short_description ||
              service.description ||
              "Professional support from the AA Kurmawa team.";

            return (
              <Reveal key={service.id} delay={index * 0.04}>
                <a
                  href={`/services/${service.slug}`}
                  className="group block border-b border-white/10"
                >
                  <div className="grid gap-7 py-8 transition-all duration-500 md:grid-cols-[80px_1fr_auto] md:items-center md:gap-10 md:py-10 lg:grid-cols-[100px_1fr_0.8fr_auto]">
                    {/* Number */}
                    <div className="flex items-center justify-between md:block">
                      <span className="text-[9px] uppercase tracking-[0.28em] text-white/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-[8px] uppercase tracking-[0.25em] text-white/25 md:hidden">
                        {service.category || "Automotive"}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="overflow-hidden">
                      <h3 className="font-serif text-3xl leading-none tracking-[-0.035em] text-white transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl lg:text-5xl">
                        {service.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="max-w-md">
                      <p className="text-xs leading-6 text-white/40 transition-colors duration-300 group-hover:text-white/60 md:text-sm">
                        {description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex h-10 w-10 items-center justify-center border border-white/15 transition-all duration-300 group-hover:border-white/50 group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.1}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom statement */}
        <div className="flex flex-col gap-8 border-b border-white/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xs text-[8px] uppercase leading-5 tracking-[0.25em] text-white/30">
            Every service.
            <br />
            One standard.
          </p>

          <a
            href="/services"
            className="group inline-flex items-center gap-4 self-start text-[9px] font-semibold uppercase tracking-[0.24em] text-white"
          >
            Explore all services
            <span className="flex h-8 w-8 items-center justify-center border border-white/20 transition-all duration-300 group-hover:border-white/60 group-hover:bg-white group-hover:text-black">
              <ArrowUpRight size={13} strokeWidth={1.1} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}