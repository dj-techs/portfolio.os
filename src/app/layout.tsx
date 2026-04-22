import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://os.djames.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "D. James Fusilier — Senior AI/ML Engineer",
    template: "%s · D. James Fusilier",
  },
  description:
    "Portfolio of D. James Fusilier — Senior AI/ML Engineer with 7+ years building RLHF pipelines, RAG systems, and production GenAI on AWS. Pick macOS or Arch Linux.",
  keywords: [
    "D. James Fusilier",
    "Senior AI/ML Engineer",
    "RLHF",
    "LLM",
    "GenAI",
    "MLOps",
    "Full Stack",
    "Portfolio",
  ],
  authors: [{ name: "D. James Fusilier" }],
  creator: "D. James Fusilier",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "D. James Fusilier — OS Portfolio",
    title: "D. James Fusilier — Senior AI/ML Engineer",
    description:
      "macOS or Arch Linux — pick your OS. A portfolio that boots.",
  },
  twitter: {
    card: "summary_large_image",
    title: "D. James Fusilier — Senior AI/ML Engineer",
    description:
      "macOS or Arch Linux — pick your OS. A portfolio that boots.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

/**
 * Root layout uses CSS font stacks (not next/font) to stay native-feeling
 * per-OS (SF on macOS, Segoe on Windows, system-ui elsewhere) and to keep
 * builds offline-safe. The theme CSS vars in globals.css (`--font-sans`,
 * `--font-mono`) carry the stacks per-shell.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
