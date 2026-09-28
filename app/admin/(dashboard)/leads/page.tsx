import Link from "next/link";
import { revalidatePath } from "next/cache";
import { ArrowUpRight, MessageSquare, Phone } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED";
  created_at: string;
  vehicle: {
    brand: string;
    model: string;
    year: number;
  } | null;
};

async function getLeads() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("leads")
    .select(`
      id,
      name,
      email,
      phone,
      message,
      status,
      created_at,
      vehicle:vehicles (
        brand,
        model,
        year
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load enquiries:", error);
    return [];
  }

 return (data ?? []).map((lead) => ({
  ...lead,
  vehicle: Array.isArray(lead.vehicle)
    ? lead.vehicle[0] ?? null
    : lead.vehicle,
})) as Lead[];
}

async function updateLeadStatus(formData: FormData) {
  "use server";

  const leadId = formData.get("leadId");
  const status = formData.get("status");

  if (
    typeof leadId !== "string" ||
    !["NEW", "CONTACTED", "CLOSED"].includes(String(status))
  ) {
    return;
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("leads")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  if (error) {
    console.error("Failed to update enquiry status:", error);
    return;
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getStatusLabel(status: Lead["status"]) {
  switch (status) {
    case "NEW":
      return "New";
    case "CONTACTED":
      return "Contacted";
    case "CLOSED":
      return "Closed";
  }
}

export default async function LeadsPage() {
  const leads = await getLeads();

  const newCount = leads.filter((lead) => lead.status === "NEW").length;
  const contactedCount = leads.filter(
    (lead) => lead.status === "CONTACTED"
  ).length;
  const closedCount = leads.filter(
    (lead) => lead.status === "CLOSED"
  ).length;

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#090b0d]">
      {/* Header */}
      <header className="border-b border-black/10 bg-[#f4f2ed]">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Customers
            </p>

            <p className="mt-1 font-serif text-xl tracking-[-0.02em]">
              Enquiries
            </p>
          </div>

          <Link
            href="/admin"
            className="text-[9px] uppercase tracking-[0.2em] text-black/45 transition-colors hover:text-black"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
        {/* Intro */}
        <div className="mb-12">
          <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
            Customer enquiries
          </p>

          <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-serif text-4xl tracking-[-0.035em] sm:text-5xl">
                Enquiries.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
                Review customer enquiries and follow up with prospective
                buyers from one place.
              </p>
            </div>

            <div className="flex gap-8">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                  New
                </p>

                <p className="mt-2 font-serif text-2xl">
                  {newCount}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                  Contacted
                </p>

                <p className="mt-2 font-serif text-2xl">
                  {contactedCount}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                  Closed
                </p>

                <p className="mt-2 font-serif text-2xl">
                  {closedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiries */}
        {leads.length === 0 ? (
          <div className="border border-black/10 bg-white/30 px-6 py-24 text-center">
            <MessageSquare
              size={22}
              strokeWidth={1.2}
              className="mx-auto text-black/25"
            />

            <p className="mt-6 font-serif text-2xl">
              No enquiries yet.
            </p>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/45">
              Customer enquiries submitted through the website will appear
              here automatically.
            </p>
          </div>
        ) : (
          <section className="border border-black/10">
            {/* Table header */}
            <div className="hidden grid-cols-[1.4fr_1.2fr_1.3fr_1fr_1.2fr] border-b border-black/10 bg-black/[0.015] px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-black/40 lg:grid">
              <span>Customer</span>
              <span>Vehicle</span>
              <span>Contact</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            {/* Rows */}
            <div>
              {leads.map((lead) => (
                <article
                  key={lead.id}
                  className="border-b border-black/10 p-6 last:border-b-0 lg:grid lg:grid-cols-[1.4fr_1.2fr_1.3fr_1fr_1.2fr] lg:items-center lg:gap-6"
                >
                  {/* Customer */}
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 lg:hidden">
                      Customer
                    </p>

                    <h2 className="mt-2 font-serif text-xl lg:mt-0">
                      {lead.name}
                    </h2>

                    {lead.message && (
                      <p className="mt-2 max-w-sm text-xs leading-5 text-black/45">
                        {lead.message}
                      </p>
                    )}
                  </div>

                  {/* Vehicle */}
                  <div className="mt-6 lg:mt-0">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 lg:hidden">
                      Vehicle
                    </p>

                    {lead.vehicle ? (
                      <Link
                        href={`/vehicles/${lead.vehicle.brand
                          .toLowerCase()
                          .replace(/\s+/g, "-")}-${lead.vehicle.model
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="group inline-flex items-center gap-2 text-sm"
                      >
                        <span>
                          {lead.vehicle.year} {lead.vehicle.brand}{" "}
                          {lead.vehicle.model}
                        </span>

                        <ArrowUpRight
                          size={13}
                          strokeWidth={1.3}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </Link>
                    ) : (
                      <p className="text-sm text-black/40">
                        General enquiry
                      </p>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="mt-6 lg:mt-0">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 lg:hidden">
                      Contact
                    </p>

                    <div className="mt-2 space-y-1 lg:mt-0">
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-2 text-xs hover:underline"
                        >
                          <Phone size={12} strokeWidth={1.3} />
                          {lead.phone}
                        </a>
                      )}

                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="block break-all text-xs text-black/45 hover:text-black"
                        >
                          {lead.email}
                        </a>
                      )}
                    </div>
                  </div>

                 {/* Status */}
                <div className="mt-6 lg:mt-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 lg:hidden">
                    Status
                </p>

                <form
                    action={updateLeadStatus}
                    className="mt-2 flex items-center gap-3 lg:mt-0"
                >
                    <input
                    type="hidden"
                    name="leadId"
                    value={lead.id}
                    />

                    <select
                    name="status"
                    defaultValue={lead.status}
                    className="w-full border-b border-black/15 bg-transparent py-2 text-xs outline-none"
                    >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="CLOSED">Closed</option>
                    </select>

                    <button
                    type="submit"
                    className="shrink-0 text-[8px] uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black"
                    >
                    Save
                    </button>
                </form>
                </div>

                  {/* Date */}
                  <div className="mt-6 lg:mt-0">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-black/35 lg:hidden">
                      Received
                    </p>

                    <p className="mt-2 text-xs text-black/45 lg:mt-0">
                      {formatDate(lead.created_at)}
                    </p>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-black/30">
                      {getStatusLabel(lead.status)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}