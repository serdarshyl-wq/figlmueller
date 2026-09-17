"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getLenis } from "@/lib/lenis";
import { ARRIVAL_MS } from "@/lib/arrival";

const SAME_PAGE_SECONDS = 1.4;
const ARRIVAL_SECONDS = 1.8;

const SETTLE_MS = 1500;
const SETTLE_STEP_MS = 90;

const FIND_FOR_MS = 4000;

const CORRECTION_PX = 8;

const LOCKED_CLASS = "is-scroll-locked";

const REACHES = ["wheel", "touchstart", "keydown"];

let wantedSection = null;

const byId = (id) => {
  if (!id) return null;
  try {
    return document.getElementById(decodeURIComponent(id));
  } catch {
    return document.getElementById(id);
  }
};

const targetOf = (hash) =>
  !hash || hash === "#" ? null : byId(hash.slice(1));

export default function useHashScroll() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const hash = window.location.hash;
    const wanted =
      wantedSection && wantedSection.path === pathname
        ? wantedSection.id
        : null;

    let timer = 0;
    let done = false;

    const toTop = () => {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true, force: true });
    };

    const aim = () => {
      const target = targetOf(hash);
      if (target) lenis.scrollTo(target, { immediate: true, force: true });
      else toTop();
    };

    const stop = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      REACHES.forEach((event) => window.removeEventListener(event, stop));
    };

    const started = performance.now();
    const again = () => {
      if (done) return;

      aim();
      if (performance.now() - started < SETTLE_MS) {
        timer = window.setTimeout(again, SETTLE_STEP_MS);
      } else {
        stop();
      }
    };

    aim();
    timer = window.setTimeout(again, SETTLE_STEP_MS);
    REACHES.forEach((event) =>
      window.addEventListener(event, stop, { passive: true })
    );

    let travel = 0;
    let watch = 0;
    if (wanted) {
      const giveUpAt = performance.now() + FIND_FOR_MS;
      const shape = () => {
        const target = byId(wanted);
        return {
          target,
          top: target ? target.getBoundingClientRect().top + window.scrollY : 0,
          height: document.documentElement.scrollHeight,
        };
      };

      let last = null;

      const travelTo = (target) => {
        wantedSection = null;
        stop();
        lenis.scrollTo(target, { duration: ARRIVAL_SECONDS });

        travel = window.setTimeout(() => {
          const off = target.getBoundingClientRect().top;
          if (Math.abs(off) > CORRECTION_PX) {
            lenis.scrollTo(target, { duration: 0.4 });
          }
        }, ARRIVAL_SECONDS * 1000 + 120);
      };

      const go = () => {
        const now = shape();
        const held = document.documentElement.classList.contains(LOCKED_CLASS);
        const still =
          last !== null &&
          Math.abs(now.top - last.top) < 1 &&
          now.height === last.height;

        last = now;

        if (now.target && !held && still) {
          watch = 0;
          travelTo(now.target);
          return;
        }

        if (performance.now() < giveUpAt) {
          watch = requestAnimationFrame(go);
          return;
        }

        watch = 0;
        wantedSection = null;
        if (now.target) travelTo(now.target);
      };

      watch = requestAnimationFrame(go);
    }

    return () => {
      stop();
      window.clearTimeout(travel);
      if (watch) cancelAnimationFrame(watch);
    };
  }, [pathname]);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;

    const onClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = event.target.closest?.("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const section = anchor.dataset?.section || url.hash.slice(1);

      if (url.pathname !== window.location.pathname) {
        if (!section) return;

        event.preventDefault();
        wantedSection = { path: url.pathname, id: section };
        router.push(url.pathname);
        return;
      }

      if (!section) {

        event.preventDefault();
        lenis.scrollTo(0, { duration: SAME_PAGE_SECONDS });
        return;
      }

      const target = byId(section);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { duration: SAME_PAGE_SECONDS });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);
}
