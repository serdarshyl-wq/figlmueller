"use client";

import { useEffect } from "react";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { getLenis } from "@/lib/lenis";

/**

 * @param {boolean} locked
 * @param {{ resetToTop?: boolean }} [options] - `resetToTop` pins the page at 0
 *   while locking, used by the intro so a refresh never starts mid-page.
 */
export default function useScrollLock(locked, { resetToTop = false } = {}) {
  useEffect(() => {
    if (!locked) return;

    if (!resetToTop) {
      lockScroll();
      return unlockScroll;
    }

    const toTop = () => {
      window.scrollTo(0, 0);
      getLenis()?.scrollTo(0, { immediate: true, force: true });
    };

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const pin = () => {
      if (window.scrollY !== 0) toTop();
    };

    toTop();
    window.addEventListener("load", pin);
    window.addEventListener("scroll", pin, { passive: true });

    lockScroll();

    return () => {
      window.removeEventListener("load", pin);
      window.removeEventListener("scroll", pin);
      unlockScroll();
    };
  }, [locked, resetToTop]);
}
