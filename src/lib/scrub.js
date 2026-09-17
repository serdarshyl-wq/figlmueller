"use client";

import gsap from "gsap";

const EASE = 0.1;
const SETTLED = 0.0002;

export function afterFonts(run) {
  const fonts = document.fonts;
  if (!fonts || fonts.status === "loaded") return;
  fonts.ready.then(run);
}

const IDLE_TIMEOUT_MS = 500;
const IDLE_FALLBACK_MS = 300;

const REACHES = ["wheel", "touchmove", "keydown", "scroll"];

export default function driveOnScroll({ root, progress, apply, ease = EASE }) {
  let eased = progress();
  apply(eased);

  let running = false;
  let idle = null;

  const tick = () => {
    const rect = root.getBoundingClientRect();

    if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
      const edge = rect.bottom <= 0 ? 1 : 0;
      if (eased !== edge) {
        eased = edge;
        apply(edge);
      }
      return;
    }

    const target = progress();
    eased += (target - eased) * ease;
    if (Math.abs(target - eased) < SETTLED) eased = target;
    apply(eased);
  };

  const stopWaiting = () => {
    if (idle !== null) {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      idle = null;
    }

    REACHES.forEach((type) => window.removeEventListener(type, begin));
  };

  function begin() {
    if (running) return;
    running = true;
    stopWaiting();
    gsap.ticker.add(tick);
  }

  idle = window.requestIdleCallback
    ? window.requestIdleCallback(begin, { timeout: IDLE_TIMEOUT_MS })
    : window.setTimeout(begin, IDLE_FALLBACK_MS);

  REACHES.forEach((type) =>
    window.addEventListener(type, begin, { passive: true })
  );

  return {
    reapply: () => apply(eased),
    stop: () => {
      stopWaiting();
      if (running) gsap.ticker.remove(tick);
      running = false;
    },
  };
}
