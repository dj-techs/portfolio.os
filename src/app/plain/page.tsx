import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";
import { experience, formatDates } from "@/content/experience";
import { skills } from "@/content/skills";
import { education } from "@/content/education";

export const metadata: Metadata = {
  title: "D. James Fusilier — AI Product Leader & Founder",
  description:
    "Plain-text resume and portfolio of D. James Fusilier (Douglas Fusilier): AI product leader and founder of AlamoIQ and WeghachiAI, building responsible, multi-agent AI for regulated industries.",
  alternates: { canonical: "/plain" },
};

// JSON-LD Person schema — the SEO workhorse. Google parses this for rich results.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.alternateNames,
  jobTitle: profile.title,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: profile.siteUrl,
  sameAs: [...profile.githubs, profile.linkedin],
  description: profile.tagline,
  knowsAbout: skills.flatMap((s) => s.items),
};

export default function PlainPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <main className="mx-auto max-w-3xl px-6 py-12 text-neutral-200">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">Also known as {profile.alternateNames[0]}</p>
          <p className="mt-2 text-neutral-400">{profile.title}</p>
          <p className="mt-2 text-sm text-neutral-500">
            <a href={`mailto:${profile.email}`} className="underline">
              {profile.email}
            </a>{" "}
            · {profile.phone} ·{" "}
            {profile.githubs.map((u) => (
              <span key={u}>
                <a href={u} className="underline">
                  GitHub ({u.split("/").pop()})
                </a>{" "}
                ·{" "}
              </span>
            ))}
            <a href={profile.linkedin} className="underline">
              LinkedIn
            </a>
          </p>
          <p className="mt-6 max-w-prose">{profile.bio}</p>
          <nav className="mt-6 flex gap-4 text-sm">
            <Link href="/" className="underline">
              Boot selector
            </Link>
            <Link href="/macos" className="underline">
              macOS
            </Link>
            <Link href="/arch" className="underline">
              Arch Linux
            </Link>
            <a href="/Resume.pdf" className="underline">
              Download PDF resume
            </a>
          </nav>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Experience</h2>
          <ul className="space-y-6">
            {experience.map((role) => (
              <li key={role.company + role.title}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">
                    {role.title} — {role.company}
                  </h3>
                  <span className="text-sm text-neutral-500">
                    {formatDates(role)}
                  </span>
                </div>
                {role.location ? (
                  <p className="text-sm text-neutral-500">{role.location}</p>
                ) : null}
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {role.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Skills</h2>
          <dl className="space-y-3 text-sm">
            {skills.map((group) => (
              <div key={group.category}>
                <dt className="font-semibold">{group.category}</dt>
                <dd className="text-neutral-400">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Education</h2>
          <ul className="space-y-2 text-sm">
            {education.map((e) => (
              <li key={e.school}>
                <span className="font-semibold">{e.school}</span> — {e.degree}
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-16 border-t border-neutral-800 pt-6 text-xs text-neutral-500">
          Prefer the theatrics?{" "}
          <Link href="/" className="underline">
            Boot the OS portfolio
          </Link>
          .
        </footer>
      </main>
    </>
  );
}
