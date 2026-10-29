"use client";
import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Mail, MapPin, Phone, Send, X } from "lucide-react";
import {
  PageHero,
  SectionHeading,
  SiteShell,
} from "@/components/site";
import { company } from "@/lib/site-data";
import { MapboxAddressMap } from "@/lib/map";
import { submitEnquiry } from "./actions";

// ── Minimal toast ─────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const id = setTimeout(onClose, 5000);
    return () => clearTimeout(id);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 border border-border bg-background px-5 py-4 shadow-lg"
      style={{ animation: "toast-in 300ms cubic-bezier(0.22,1,0.36,1)" }}
    >
      <CheckCircle2 size={18} className="shrink-0 text-accent" />
      <p className="text-sm font-semibold">{message}</p>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="ml-2 text-muted-foreground hover:text-foreground"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const TO = "info@negoconstruction.com";

export default function ContactClient() {
  const [toast, setToast] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = fd.get("firstName") as string;
    const lastName  = fd.get("lastName")  as string;
    const email     = fd.get("email")     as string;
    const phone     = fd.get("phone")     as string;
    const message   = fd.get("message")   as string;

    // Persist enquiry to Supabase via Server Action.
    // Wrapped in try/catch — failure must not prevent the mailto fallback
    // (Requirement 10.7: fail-open, no enquiry is lost).
    try {
      await submitEnquiry(fd);
    } catch (err) {
      // Log silently; the mailto path below still runs unconditionally.
      console.error("[ContactForm] submitEnquiry failed:", err);
    }

    const subject = encodeURIComponent(
      `Enquiry from ${firstName} ${lastName} — NEGO Construction`
    );
    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone || "—"}\n\n${message}`
    );

    // Open user's email client pre-filled — unconditional (Requirement 10.7)
    window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;

    // Show toast after a short delay (gives mailto time to trigger)
    setTimeout(() => setToast(true), 400);
    form.reset();
  }

  return (
    <SiteShell>
      {toast && (
        <Toast
          message="Your email client has opened. Please send the message to complete your enquiry."
          onClose={() => setToast(false)}
        />
      )}

      <main>
        <PageHero
          eyebrow="Contact NEGO"
          title="Let's build together."
          description="We are happy to hear from you. Visit our office, give us a call or fill out the enquiry form to get a quick response from our team."
        />

        <section className="container grid gap-12 py-20 md:grid-cols-[1.1fr_.9fr] md:py-28">
          <form
            onSubmit={submit}
            className="flex flex-col gap-6 border border-border p-7 md:p-10 h-fit"
          >
            <div>
              <p className="eyebrow text-accent">Start a conversation</p>
              <h2 className="mt-4 text-3xl font-black">
                Tell us about your project.
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Share enough detail for us to understand the opportunity and the
                kind of support you need.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-bold">
                First name *
                <input
                  name="firstName"
                  required
                  className="border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-bold">
                Last name
                <input
                  name="lastName"
                  className="border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm font-bold">
              Email *
              <input
                name="email"
                required
                type="email"
                className="border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold">
              Phone number
              <input
                name="phone"
                type="tel"
                className="border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold">
              Message *
              <textarea
                name="message"
                required
                rows={7}
                placeholder="Tell us about your project..."
                className="border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <button type="submit" className="button-primary w-full">
              Submit enquiry <Send data-icon="inline-end" />
            </button>
          </form>

          <aside className="flex flex-col gap-8">
            <div className="border border-border p-8 md:p-10">
              <p className="eyebrow text-accent">Find us</p>
              <h2 className="mt-4 text-3xl font-black">{company.name}</h2>
              <div className="mt-8 flex flex-col gap-6 text-sm leading-6 text-muted-foreground">
                <p className="flex gap-3">
                  <MapPin className="shrink-0 text-accent" />
                  {company.address}
                </p>
                <p className="flex gap-3">
                  <Phone className="shrink-0 text-accent" />
                  {company.phones.join(" · ")}
                </p>
                <a
                  href={`mailto:${company.email}`}
                  className="flex gap-3 hover:text-accent transition-colors"
                >
                  <Mail className="shrink-0 text-accent" />
                  {company.email}
                </a>
              </div>
            </div>
            <MapboxAddressMap
              address={company.address}
              label="Office/location map slot · supplied embed pending"
              tall
              height="60dvh"
              className="border border-border md:h-[60dvh] lg:h-[70dvh]"
            />
          </aside>
        </section>

        <section className="bg-muted py-20 md:py-28">
          <div className="container">
            <SectionHeading
              eyebrow="What happens next"
              title="A straightforward first conversation."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "We review your enquiry",
                "We arrange a discovery conversation",
                "We recommend the next practical step",
              ].map((item, index) => (
                <article
                  key={item}
                  className="border border-border bg-background p-8"
                >
                  <span className="font-display text-4xl font-bold text-accent">
                    0{index + 1}
                  </span>
                  <p className="mt-12 text-lg font-bold">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
