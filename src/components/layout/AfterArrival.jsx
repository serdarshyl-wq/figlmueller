"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ARRIVAL_MS, arrivedByNavigation, rememberPage } from "@/lib/arrival";
import useScrollLock from "@/hooks/useScrollLock";

const HOLD_MS = ARRIVAL_MS;

export default function AfterArrival({ children }) {
  const pathname = usePathname();

  const [ready, setReady] = useState(
    () =>
      !arrivedByNavigation(pathname) ||
      (typeof window !== "undefined" && window.location.hash !== "")
  );

  useScrollLock(!ready);

  useEffect(() => {
    rememberPage(pathname);
  }, [pathname]);

  useEffect(() => {
    if (ready) return;

    const timer = window.setTimeout(() => setReady(true), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [ready]);

  /* Held with no children of its own where a page has nothing heavy enough to
     wait for: what is wanted then is the lock and the page's own memory, not
     the holding back. */
  return ready ? (children ?? null) : null;
}
