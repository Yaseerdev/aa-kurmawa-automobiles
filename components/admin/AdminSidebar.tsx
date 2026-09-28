"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  CalendarDays,
  BriefcaseBusiness,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  BookOpen,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Inventory",
    items: [
      {
        label: "Vehicles",
        href: "/admin/vehicles",
        icon: Car,
      },
      {
        label: "Add vehicle",
        href: "/admin/vehicles/new",
        icon: Plus,
      },
    ],
  },
  {
    label: "Customers",
    items: [
      {
        label: "Enquiries",
        href: "/admin/leads",
        icon: MessageSquare,
      },
      {
        label: "Appointments",
        href: "/admin/appointments",
        icon: CalendarDays,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        label: "Services",
        href: "/admin/services",
        icon: BriefcaseBusiness,
      },
      {
        label: "Journal",
        href: "/admin/journal",
        icon: BookOpen,
      },
      {
        label: "Site settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="hidden min-h-screen w-[250px] shrink-0 border-r border-black/10 bg-[#090b0d] text-white lg:flex lg:flex-col">
      {/* Brand */}
      <div className="border-b border-white/10 px-7 py-7">
        <Link href="/admin" className="block">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/45">
            AA Kurmawa
          </p>

          <p className="mt-1 font-serif text-lg tracking-[-0.02em]">
            Automobiles
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-7">
        <div className="space-y-8">
          {navigation.map((section) => (
            <div key={section.label}>
              <p className="mb-3 px-3 text-[8px] uppercase tracking-[0.28em] text-white/25">
                {section.label}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2.5 text-[10px] uppercase tracking-[0.12em] transition-colors ${
                        isActive
                          ? "bg-white text-black"
                          : "text-white/45 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon
                        size={14}
                        strokeWidth={1.4}
                        className={
                          isActive
                            ? "text-black"
                            : "text-white/30 group-hover:text-white/60"
                        }
                      />

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="group mb-1 flex items-center gap-3 px-3 py-2.5 text-[10px] uppercase tracking-[0.12em] text-white/35 transition-colors hover:text-white"
        >
          <ExternalLink
            size={14}
            strokeWidth={1.4}
            className="text-white/25 group-hover:text-white/60"
          />

          <span>View website</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="group flex w-full items-center gap-3 px-3 py-2.5 text-[10px] uppercase tracking-[0.12em] text-white/35 transition-colors hover:text-white"
        >
          <LogOut
            size={14}
            strokeWidth={1.4}
            className="text-white/25 group-hover:text-white/60"
          />

          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}