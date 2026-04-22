"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// react-pdf v10 loads its worker from a CDN by default. Be explicit so we don't
// rely on whatever bundler guessed.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ src }: { src: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const update = () => setWidth(Math.min(680, window.innerWidth * 0.6));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="flex h-full flex-col bg-neutral-800 text-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-black/30 px-3 py-1.5 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded bg-white/10 px-2 py-0.5 hover:bg-white/20"
            disabled={page <= 1}
          >
            ‹
          </button>
          <span>
            Page {page} / {numPages ?? "—"}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(numPages ?? p, p + 1))}
            className="rounded bg-white/10 px-2 py-0.5 hover:bg-white/20"
            disabled={!!numPages && page >= numPages}
          >
            ›
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}
            className="rounded bg-white/10 px-2 py-0.5 hover:bg-white/20"
          >
            −
          </button>
          <span className="tabular-nums">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(2, s + 0.1))}
            className="rounded bg-white/10 px-2 py-0.5 hover:bg-white/20"
          >
            +
          </button>
          <a
            href={src}
            download
            className="ml-2 rounded bg-[color:var(--accent)] px-2 py-0.5 text-[11px] text-white"
          >
            Download
          </a>
        </div>
      </div>

      {/* Document */}
      <div className="relative flex-1 overflow-auto bg-neutral-700 p-4">
        <div className="mx-auto">
          <Document
            file={src}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="py-8 text-center text-xs text-white/60">Loading PDF…</div>
            }
            error={
              <div className="py-8 text-center text-xs text-red-400">
                Could not load the PDF.{" "}
                <a href={src} className="underline">
                  Download instead
                </a>
                .
              </div>
            }
            className="flex justify-center"
          >
            <Page
              pageNumber={page}
              scale={scale}
              width={width}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
