"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("The email or password you entered is incorrect.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#090b0d] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_35%),linear-gradient(135deg,#111416,#080909)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <p className="text-[9px] uppercase tracking-[0.38em] text-white/45">
                AA Kurmawa Automobiles
              </p>

              <div className="mt-3 h-px w-10 bg-white/30" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/35">
                Digital showroom
              </p>

              <h1 className="mt-5 max-w-lg font-serif text-6xl leading-[0.95] tracking-[-0.045em] xl:text-7xl">
                Driven by
                <br />
                <span className="text-white/55">excellence.</span>
              </h1>

              <p className="mt-8 max-w-md text-sm leading-7 text-white/40">
                Manage inventory, customer enquiries and showroom
                appointments from one place.
              </p>
            </div>

            <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
              Kano · Nigeria
            </p>
          </div>
        </section>

        {/* Login panel */}
        <section className="flex min-h-screen items-center bg-[#f4f2ed] text-[#090b0d]">
          <div className="mx-auto w-full max-w-md px-7 py-12 sm:px-10 lg:px-14 xl:max-w-lg xl:px-20">
            {/* Mobile brand */}
            <div className="mb-20 lg:hidden">
              <p className="text-[9px] uppercase tracking-[0.32em] text-black/40">
                AA Kurmawa Automobiles
              </p>

              <div className="mt-3 h-px w-8 bg-black/20" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
                Authorized access
              </p>

              <h2 className="mt-4 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">
                Welcome back.
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-black/45">
                Sign in to manage the AA Kurmawa digital showroom.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-12">
              <div className="space-y-7">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-black/40"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                    placeholder="admin@aakurmawaautomobiles.com.ng"
                    className="w-full border-b border-black/15 bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-black/20 focus:border-black"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-black/40"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="w-full border-b border-black/15 bg-transparent px-0 py-3 pr-10 text-sm outline-none transition-colors placeholder:text-black/20 focus:border-black"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-0 top-2.5 p-1 text-black/35 transition-colors hover:text-black"
                    >
                      {showPassword ? (
                        <EyeOff size={16} strokeWidth={1.4} />
                      ) : (
                        <Eye size={16} strokeWidth={1.4} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 border border-red-900/10 bg-red-50 px-4 py-3">
                  <p className="text-xs leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-9 flex w-full items-center justify-between bg-[#090b0d] px-5 py-4 text-[9px] font-medium uppercase tracking-[0.22em] text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {loading ? "Signing in..." : "Enter dashboard"}
                </span>

                {!loading && (
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </form>

            <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-5">
              <p className="text-[8px] uppercase tracking-[0.2em] text-black/30">
                Authorized personnel only
              </p>

              <p className="text-[8px] uppercase tracking-[0.2em] text-black/25">
                AA · 2026
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}