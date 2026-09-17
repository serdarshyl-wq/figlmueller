"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LogoLockup from "@/components/brand/LogoLockup";
import useReducedMotion from "@/hooks/useReducedMotion";

/**
 * The intro copy of the logo: it builds itself piece by piece and is later
 * flown into the header by HeroIntro, which owns the timing.
 * @param {object} props
 * @param {import("react").RefObject<HTMLDivElement>} props.rootRef
 * @param {boolean} [props.instant] - show the finished lockup with no build,
 *   for when the visitor has skipped the intro.
 */
export default function IntroLogo({ rootRef, className = "", instant = false }) {
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".logo-icon",
        { autoAlpha: 0, rotate: -360, scale: 0.88 },
        {
          autoAlpha: 1,
          rotate: 0,
          scale: 1,
          duration: 1.6,
          ease: "power3.inOut",
        },
        0
      ).fromTo(
        ".logo-line",
        { "--wipe": "100%", x: -18 },
        { "--wipe": "0%", x: 0, duration: 1.25, stagger: 0.3 },
        1.05
      );

      if (prefersReducedMotion || instant) tl.progress(1);
    },
    { scope: rootRef, dependencies: [prefersReducedMotion, instant] }
  );

  return (
    <div ref={rootRef} className={className}>
      <LogoLockup staged priority className="w-full" />
    </div>
  );
}
