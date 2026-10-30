import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

/**
 * Admin login page — Server Component shell.
 * Accessible without a session: the proxy allows /admin/login through.
 * The interactive form is extracted to a Client Component so it can
 * manage error state and progressive enhancement.
 */
export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      {/* Brand panel: hidden on mobile/tablet, full panel on desktop */}
      <section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#033a21] px-6 py-6 text-white sm:px-10 sm:py-8 lg:min-h-screen lg:px-14 lg:py-12">
        {/* soft decorative rings */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-40 hidden h-[28rem] w-[28rem] rounded-full border border-white/10 lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-20 hidden h-[18rem] w-[18rem] rounded-full border border-white/10 lg:block"
        />

        <header className="relative flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="NEGO Construction"
            width={120}
            height={40}
            className="h-10 w-auto object-contain brightness-0 invert"
            priority
          />
        </header>

        <div className="relative hidden max-w-xl lg:block">
          <p className="text-sm text-emerald-100/70">Admin Dashboard</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight xl:text-6xl">
            Good decisions need a clear system.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-emerald-100/80">
            Sign in to continue managing controlled, auditable instructions.
          </p>
        </div>

        <p className="relative hidden text-sm text-emerald-100/60 lg:block">
          Secure access &middot; Role-aware controls &middot; Full audit history
        </p>
      </section>

      {/* Form panel */}
      <section className="flex flex-col px-6 py-8 sm:px-10 lg:px-16">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded text-sm text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#033a21]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <Image
              src="/logo.png"
              alt="NEGO Construction"
              width={120}
              height={40}
              className="h-12 w-auto object-contain"
            />

            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-base text-neutral-600">
              Sign in to your NEGO Admin Dashboard.
            </p>

            <div className="mt-8">
              <LoginForm />
            </div>

            <p className="mt-8 text-center text-sm text-neutral-600">
              Need access?{" "}
              <span className="font-medium text-neutral-900">
                Contact your administrator
              </span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
