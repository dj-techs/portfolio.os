"use client";

import Image from "next/image";
import { profile } from "@/content/profile";

export default function AboutMe() {
  return (
    <div className="flex h-full flex-col items-center overflow-auto bg-gradient-to-b from-neutral-900 to-neutral-950 px-8 py-6 text-white">
      <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white/20 bg-neutral-800">
        <Image
          src={profile.avatar}
          alt={profile.name}
          fill
          sizes="112px"
          className="object-cover"
          // If avatar.jpg missing, show initials fallback
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 grid place-items-center text-3xl font-semibold text-white/80">
          DJ
        </div>
      </div>
      <h1 className="mt-4 text-lg font-semibold">{profile.name}</h1>
      <p className="text-xs text-white/60">{profile.title}</p>

      <div className="mt-6 w-full max-w-md space-y-4 text-sm leading-relaxed text-white/80">
        <p>{profile.tagline}</p>
      </div>

      <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-3 text-xs">
        <Row label="Email">
          <a className="text-[color:var(--accent)] hover:underline" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </Row>
        <Row label="Phone">{profile.phone}</Row>
        <Row label="Location">{profile.location}</Row>
        <Row label="GitHub">
          <a
            className="text-[color:var(--accent)] hover:underline"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            dj-techs
          </a>
        </Row>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-white/5 bg-white/5 p-2">
      <div className="text-[10px] uppercase tracking-wide text-white/40">{label}</div>
      <div className="mt-0.5 truncate text-white/90">{children}</div>
    </div>
  );
}
