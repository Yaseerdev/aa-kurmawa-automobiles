import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/lib/queries/site-settings";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Current Stock", href: "/vehicles" },
  { label: "Services", href: "/#services" },
  { label: "About Us", href: "/about" },
];

function cleanPhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function getWhatsAppNumber(whatsapp: string | null, phone: string) {
  if (whatsapp) {
    return whatsapp.replace(/[^\d]/g, "");
  }

  const cleaned = phone.replace(/[^\d]/g, "");

  if (cleaned.startsWith("0")) {
    return `234${cleaned.slice(1)}`;
  }

  if (cleaned.startsWith("234")) {
    return cleaned;
  }

  return cleaned;
}

export async function SiteFooter() {
  const settings = await getSiteSettings();

  const businessName =
    settings?.business_name || "AA Kurmawa Automobiles";

  const tagline =
    settings?.tagline ||
    "Driven by Integrity, Powered by Excellence";

  const phone = settings?.phone || "07077773521";

  const address =
    settings?.address ||
    "No. 346 Abdullahi Bayero Road, Kano, Nigeria";

  const email = settings?.email || null;

  const whatsappNumber = getWhatsAppNumber(
    settings?.whatsapp || null,
    phone
  );

  const phoneHref = `tel:${cleanPhone(phone)}`;
  const whatsappHref = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">

        {/* Main footer */}
        <div className="grid gap-12 border-b border-white/10 py-10 md:grid-cols-[1.4fr_0.7fr_1fr] md:gap-16 md:py-10">

          {/* Brand */}
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/40">
              {businessName}
            </p>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
              {tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/35">
              Explore
            </p>

            <nav className="mt-5 flex flex-col gap-3">
              {navigation.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group inline-flex w-fit items-center gap-2 text-sm text-white/65 transition-colors duration-200 hover:text-white"
                >
                  {link.label}

                  <ArrowUpRight
                    size={11}
                    strokeWidth={1.2}
                    className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[8px] font-medium uppercase tracking-[0.28em] text-white/35">
              Contact
            </p>

            <div className="mt-5 space-y-3">
              <a
                href={phoneHref}
                className="block text-sm text-white/75 transition-colors hover:text-white"
              >
                {phone}
              </a>

              <p className="max-w-sm text-sm leading-6 text-white/50">
                {address}
              </p>

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="block text-sm text-white/60 transition-colors hover:text-white"
                >
                  {email}
                </a>
              )}

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 pt-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-white"
              >
                WhatsApp
                <ArrowUpRight
                  size={11}
                  strokeWidth={1.2}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
            <span>Kano, Nigeria</span>

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <span>Automotive · Trade · Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}