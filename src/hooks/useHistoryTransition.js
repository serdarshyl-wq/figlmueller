"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function useHistoryTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const pathRef = useRef(pathname);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const onPopState = (event) => {
      if (!event.state || !event.state.__NA) return;

      if (window.location.pathname === pathRef.current) return;

      event.stopImmediatePropagation();
      router.replace(window.location.href);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [router]);
}
