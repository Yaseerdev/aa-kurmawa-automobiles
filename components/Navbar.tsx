"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const sectionHref = (section: string) => {
    return pathname === "/" ? `#${section}` : `/#${section}`;
  };

  const navItems = [
    {
      label: "Vehicles",
      href: sectionHref("collection"),
    },
    {
      label: "Services",
      href: sectionHref("services"),
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: sectionHref("contact"),
    },
  ];

  return (
    <header className="absolute left-0 top-0 z-50 w-full px-5 py-5 md:px-10 md:py-7">
      <nav className="mx-auto flex max-w-400 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center border border-white/30 text-sm font-bold tracking-[-.08em]">
            AA
          </div>

          <div className="hidden sm:block">
            <div className="text-[12px] font-semibold tracking-[.18em]">
              KURMAWA
            </div>

            <div className="text-[8px] tracking-[.28em] text-white/50">
              AUTOMOBILES
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[10px] uppercase tracking-[.2em] text-white/75 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href={pathname === "/" ? "#appointment" : "/#appointment"}
            className="group flex items-center gap-2 border border-white/35 px-4 py-3 text-[10px] uppercase tracking-[.16em] transition hover:bg-white hover:text-black"
          >
            Book an appointment

            <ArrowUpRight
              size={13}
              className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="mt-5 border border-white/15 bg-black/95 p-6 md:hidden">
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[.18em]"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href={pathname === "/" ? "#appointment" : "/#appointment"}
              onClick={() => setOpen(false)}
              className="border border-white/30 px-4 py-3 text-center text-xs uppercase tracking-[.15em]"
            >
              Book an appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}