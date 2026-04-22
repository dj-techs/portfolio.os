"use client";

import { useEffect, useState } from "react";

/**
 * Gate any rendering that depends on persisted zustand state behind this hook
 * to avoid SSR/CSR hydration mismatches:
 *
 *   const hydrated = useHydrated();
 *   const lastOS = useOsStore((s) => s.lastOS);
 *   if (!hydrated) return <Skeleton />;
 */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => {
    // Intentional: hydration-gate pattern. Once mounted on the client, flip
    // the flag so persisted state becomes safe to read without SSR/CSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setH(true);
  }, []);
  return h;
}
