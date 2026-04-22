"use client";

import dynamic from "next/dynamic";
import { projects } from "@/content/projects";

// react-pdf must be client-only and SSR off. Load lazily.
const PdfViewer = dynamic(() => import("@/shared/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-xs text-white/50">
      Loading PDF…
    </div>
  ),
});

type Props = {
  src?: string;
  kind?: "pdf" | "project";
  slug?: string;
};

export default function Preview(props: Props) {
  if (props.kind === "project" && props.slug) {
    const p = projects.find((x) => x.slug === props.slug);
    if (!p) {
      return <ErrorPane message={`Project not found: ${props.slug}`} />;
    }
    return <ProjectReader slug={props.slug} />;
  }

  return (
    <div className="flex h-full flex-col bg-neutral-900">
      <PdfViewer src={props.src ?? "/Resume.pdf"} />
    </div>
  );
}

function ProjectReader({ slug }: { slug: string }) {
  const p = projects.find((x) => x.slug === slug)!;
  return (
    <article className="prose-invert h-full overflow-auto bg-neutral-950 px-8 py-6 text-sm leading-relaxed text-white/90">
      <h1 className="mb-1 text-xl font-bold text-white">{p.title}</h1>
      <p className="mb-6 text-xs text-white/50">
        {p.company} · {p.year}
      </p>
      <p className="mb-5 text-[13px] text-white/80">{p.summary}</p>
      <Section title="Problem">{p.problem}</Section>
      <Section title="Approach">{p.approach}</Section>
      <Section title="Stack">
        <div className="flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span
              key={s}
              className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px]"
            >
              {s}
            </span>
          ))}
        </div>
      </Section>
      <Section title="Outcome">
        <strong className="text-emerald-400">{p.outcome}</strong>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/50">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function ErrorPane({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-red-400">
      {message}
    </div>
  );
}
