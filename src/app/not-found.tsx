import Link from "next/link";

export const metadata = {
  title: "404 · The operation can't be completed",
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-black p-6 text-white">
      <div className="max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-8 text-sm shadow-2xl">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-white/60">Finder</span>
        </div>

        <h1 className="text-lg font-semibold">
          The operation can&apos;t be completed
        </h1>
        <p className="mt-2 text-white/70">
          because the item can&apos;t be found. <span className="font-mono">(-43)</span>
        </p>

        <div className="my-6 h-px bg-white/10" />

        <pre className="font-mono text-[11px] leading-5 text-[color:var(--term-green,#8ec07c)]">
{`[guest@archlinux ~]$ cat 404.txt
cat: 404.txt: No such file or directory`}
        </pre>

        <div className="mt-6 flex flex-wrap gap-3 text-xs">
          <Link
            href="/"
            className="rounded-full bg-white px-4 py-1.5 font-medium text-black"
          >
            ← Boot selector
          </Link>
          <Link
            href="/macos"
            className="rounded-full border border-white/20 px-4 py-1.5"
          >
            macOS
          </Link>
          <Link
            href="/arch"
            className="rounded-full border border-white/20 px-4 py-1.5"
          >
            Arch
          </Link>
          <Link
            href="/plain"
            className="rounded-full border border-white/20 px-4 py-1.5"
          >
            Plain résumé
          </Link>
        </div>
      </div>
    </main>
  );
}
