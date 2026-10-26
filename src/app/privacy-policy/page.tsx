import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell, PageHero } from "@/components/site";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for NEGO Construction Limited — how we collect, use, and protect your personal data in accordance with the Nigeria Data Protection Regulation (NDPR).",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <main>
        <PageHero
          eyebrow="Legal"
          title="Privacy Policy"
          description="How NEGO Construction Limited collects, uses, and protects your personal data."
        />

        <article className="container max-w-3xl py-16 md:py-24">
          <div className="prose prose-neutral max-w-none leading-8 text-muted-foreground [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mt-2">

            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>

            <h2>1. Introduction</h2>
            <p>
              {company.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting
              the personal information of everyone who interacts with our
              website at{" "}
              <Link
                href="https://www.negoconstruction.com"
                className="text-accent underline underline-offset-4"
              >
                www.negoconstruction.com
              </Link>{" "}
              (the &ldquo;Website&rdquo;). This Privacy Policy explains what personal data
              we collect, how we use it, how long we keep it, and your rights
              under the Nigeria Data Protection Regulation (NDPR) and other
              applicable laws.
            </p>
            <p>
              By using our Website, you agree to the collection and use of
              information in accordance with this policy. If you do not agree,
              please refrain from using the Website.
            </p>

            <h2>2. Data Controller</h2>
            <p>
              The data controller responsible for your personal information is:
            </p>
            <address className="mt-4 not-italic rounded border border-border bg-muted p-6 text-sm leading-7">
              <strong className="block text-foreground">{company.name}</strong>
              {company.address}
              <br />
              <a
                href={`mailto:${company.email}`}
                className="text-accent underline underline-offset-4"
              >
                {company.email}
              </a>
            </address>

            <h2>3. What Personal Data We Collect</h2>
            <p>
              We collect personal data only when you voluntarily submit the
              contact form on our Website. The data collected includes:
            </p>
            <ul>
              <li>
                <strong>First name and last name</strong> — to address you
                correctly in our response.
              </li>
              <li>
                <strong>Email address</strong> — to respond to your enquiry.
              </li>
              <li>
                <strong>Phone number</strong> (optional) — to follow up by
                phone if you prefer.
              </li>
              <li>
                <strong>Message content</strong> — the details of your enquiry
                or request.
              </li>
            </ul>
            <p>
              We also collect non-personal, aggregated analytics data (page
              views, referral sources, device type) through Vercel Analytics,
              but only if you have given your consent via the cookie consent
              banner. This data cannot be used to identify you personally.
            </p>

            <h2>4. How We Use Your Data</h2>
            <p>
              We use the personal data you provide through the contact form
              solely to:
            </p>
            <ul>
              <li>Respond to your enquiry or request.</li>
              <li>
                Follow up on a potential project, service, or business
                relationship.
              </li>
              <li>
                Maintain a record of communications for internal reference.
              </li>
            </ul>
            <p>
              We do not use your personal data for unsolicited marketing, and
              we do not sell, rent, or share your data with third parties for
              their own commercial purposes.
            </p>

            <h2>5. Legal Basis for Processing</h2>
            <p>
              We process your personal data on the basis of your{" "}
              <strong>consent</strong> (Article 2.1(a) NDPR) — you choose to
              submit the contact form. You may withdraw this consent at any
              time by contacting us at{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-accent underline underline-offset-4"
              >
                {company.email}
              </a>
              .
            </p>

            <h2>6. How Long We Keep Your Data</h2>
            <p>
              We retain contact enquiry records for a maximum of{" "}
              <strong>24 months</strong> from the date of submission, unless
              you request earlier deletion or we have an ongoing business
              relationship that warrants a longer retention period. After this
              period, records are permanently deleted from our systems.
            </p>

            <h2>7. Data Security</h2>
            <p>
              We take appropriate technical and organisational measures to
              protect your personal data against unauthorised access, loss,
              destruction, or alteration. Contact enquiries are stored in a
              secured database with access restricted to authorised NEGO
              Construction staff only.
            </p>
            <p>
              Despite our best efforts, no method of transmission over the
              internet is 100% secure. We encourage you to contact us
              immediately at{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-accent underline underline-offset-4"
              >
                {company.email}
              </a>{" "}
              if you have any concerns about the security of your data.
            </p>

            <h2>8. Cookies and Analytics</h2>
            <p>
              Our Website uses a single first-party cookie to record your
              analytics consent preference:
            </p>
            <ul>
              <li>
                <strong>nego_consent</strong> — stores whether you have
                accepted or declined analytics tracking. This cookie has a
                lifespan of 365 days and is not used for any purpose other
                than recording your preference.
              </li>
            </ul>
            <p>
              Vercel Analytics tracking is only activated if you click
              &ldquo;Accept&rdquo; on the cookie consent banner. You may change your
              preference at any time by clearing your browser cookies, which
              will cause the consent banner to reappear on your next visit.
            </p>

            <h2>9. Your Rights Under the NDPR</h2>
            <p>
              Under the Nigeria Data Protection Regulation, you have the
              following rights with respect to your personal data:
            </p>
            <ul>
              <li>
                <strong>Right of access</strong> — you may request a copy of
                the personal data we hold about you.
              </li>
              <li>
                <strong>Right to rectification</strong> — you may ask us to
                correct any inaccurate or incomplete data.
              </li>
              <li>
                <strong>Right to erasure</strong> — you may request that we
                delete your personal data, subject to any legal obligations we
                have to retain it.
              </li>
              <li>
                <strong>Right to restrict processing</strong> — you may ask us
                to temporarily stop using your data while a dispute is
                resolved.
              </li>
              <li>
                <strong>Right to withdraw consent</strong> — where processing
                is based on consent, you may withdraw it at any time without
                affecting the lawfulness of prior processing.
              </li>
              <li>
                <strong>Right to lodge a complaint</strong> — you have the
                right to complain to the Nigeria Data Protection Commission
                (NDPC) if you believe your rights have been violated.
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-accent underline underline-offset-4"
              >
                {company.email}
              </a>
              . We will respond to all requests within 30 days.
            </p>

            <h2>10. Third-Party Services</h2>
            <p>
              Our Website uses the following third-party services, each of
              which has its own privacy policy:
            </p>
            <ul>
              <li>
                <strong>Vercel</strong> — website hosting and edge network
                (analytics only if consented).
              </li>
            </ul>
            <p>
              We do not embed third-party social media widgets, advertising
              networks, or tracking pixels that collect your data without your
              knowledge.
            </p>

            <h2>11. Children&apos;s Privacy</h2>
            <p>
              Our Website is not directed at children under the age of 18. We
              do not knowingly collect personal data from children. If you
              believe we have inadvertently collected data from a child, please
              contact us immediately so we can delete it.
            </p>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or applicable law. We will indicate the
              &ldquo;Last updated&rdquo; date at the top of the page. Continued use of the
              Website after any changes constitutes your acceptance of the
              updated policy.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or the way we handle your data, please contact us:
            </p>
            <address className="mt-4 not-italic rounded border border-border bg-muted p-6 text-sm leading-7">
              <strong className="block text-foreground">{company.name}</strong>
              {company.address}
              <br />
              <a
                href={`mailto:${company.email}`}
                className="text-accent underline underline-offset-4"
              >
                {company.email}
              </a>
              <br />
              {company.phones[0]}
            </address>

            <p className="mt-8">
              <Link href="/contact" className="text-accent underline underline-offset-4">
                Contact us via our website form
              </Link>{" "}
              or email us directly — we aim to respond within 2 business days.
            </p>
          </div>
        </article>
      </main>
    </SiteShell>
  );
}
