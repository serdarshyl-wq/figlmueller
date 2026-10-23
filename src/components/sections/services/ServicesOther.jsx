"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import { NAV_LINKS } from "@/config/navigation";
import driveOnScroll, { afterFonts } from "@/lib/scrub";

const HEADING = ["Other", "Services"];

const SERVICES =
  NAV_LINKS.find((link) => link.label === "Services")?.submenu ?? [];

const BUILD_CLEARANCE = 0.035;
const SPLIT_OPACITY = 0.5;

const LIST_NUDGE = 0.03;

const LIST_FROM = 0.72;
const LINE_SPREAD = 0.07;

const RUNWAY_VH = 2;
const SCRUB = 0.1;

const SPLIT_AT = 0;
const SPLIT_DURATION = 1.6;
const LINES_AT = 0.5;

const LINES_DURATION = 1;

const TIMELINE_END = Math.max(
  SPLIT_AT + SPLIT_DURATION,
  LINES_AT + LINES_DURATION
);

export default function ServicesOther({ heading, services }) {
  /* Written in the studio, or what the band ships with. */
  const words = heading?.length ? heading : HEADING;
  const others = services?.length ? services : SERVICES;

  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const heading = root.querySelector(".other-heading");
      const halves = root.querySelectorAll(".other-half");
      const [left, right] = halves;
      const list = root.querySelector(".other-list");
      const lines = root.querySelectorAll(".other-line");
      if (!heading || !left || !right || !list) return;

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        gsap.set(halves, { x: 0, y: 0, xPercent: 0, yPercent: 0 });
        gsap.set(heading, { opacity: 1 });
        gsap.set(list, {
          x: window.innerWidth * LIST_NUDGE,
          y: 0,
          xPercent: 0,
          yPercent: 0,
        });
        gsap.set(lines, { x: 0, y: 0, xPercent: 0, yPercent: 0 });

        const leftRect = left.getBoundingClientRect();
        const rightRect = right.getBoundingClientRect();
        const listRect = list.getBoundingClientRect();

        const clearance = window.innerWidth * BUILD_CLEARANCE;
        const leftX = listRect.left - clearance - leftRect.right;
        const rightX = listRect.right + clearance - rightRect.left;

        const spread = window.innerHeight * LINE_SPREAD;
        gsap.set(list, { y: window.innerHeight * LIST_FROM });
        gsap.set(lines, { y: (index) => index * spread });

        tl = gsap.timeline({ paused: true });
        tl.to(
          left,
          { x: leftX, duration: SPLIT_DURATION, ease: "none" },
          SPLIT_AT
        )
          .to(
            right,
            { x: rightX, duration: SPLIT_DURATION, ease: "none" },
            SPLIT_AT
          )
          .to(
            heading,
            { opacity: SPLIT_OPACITY, duration: SPLIT_DURATION, ease: "none" },
            SPLIT_AT
          )
          .to(list, { y: 0, duration: LINES_DURATION, ease: "none" }, LINES_AT)
          .to(lines, { y: 0, duration: LINES_DURATION, ease: "none" }, LINES_AT)
          .to({}, { duration: 0 }, TIMELINE_END);
      };

      build();

      const clamp01 = gsap.utils.clamp(0, 1);

      const scrollProgress = () => {
        const rect = root.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        if (travel <= 0) return 0;
        return clamp01(-rect.top / travel);
      };

      const scrub = driveOnScroll({
        root: root,
        progress: scrollProgress,
        apply: (value) => tl.progress(value),
        ease: SCRUB,
      });

      const rebuild = () => {
        if (disposed) return;
        build();
        scrub.reapply();
      };

      window.addEventListener("resize", rebuild);
      afterFonts(rebuild);

      return () => {
        disposed = true;
        scrub.stop();
        window.removeEventListener("resize", rebuild);
        tl?.kill();
      };
    },
    { dependencies: [animated] }
  );

  return (
    <section
      ref={rootRef}
      id="other-services"
      aria-labelledby="other-services-heading"
      className="relative z-10 bg-bone text-black"
      style={animated ? { height: `${RUNWAY_VH * 100}vh` } : undefined}
    >
      <div
        className={
          animated
            ? "sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6"
            : "flex flex-col items-center gap-10 px-6 py-24"
        }
      >
        <h2
          id="other-services-heading"
          className={
            animated
              ? "other-heading pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap font-display text-[11vw] font-semibold uppercase leading-none tracking-[-0.03em]"
              : "font-display text-[clamp(2.5rem,9vw,7rem)] font-semibold uppercase leading-none tracking-[-0.03em]"
          }
        >
          {words.map((word, index) => (
            <span
              key={word}
              className={`other-half block will-change-transform${index === 0 ? " mr-[0.22em]" : ""
                }`}
            >
              {word}
            </span>
          ))}
        </h2>

        <div
          className={`other-list relative z-10 flex flex-col items-center${animated ? " will-change-transform" : ""
            }`}
        >
          <ul className="flex flex-col items-center text-center">
            {others.map((service) => (
              <li
                key={service.href}
                className={`other-line${animated ? " will-change-transform" : ""}`}
              >
                <Link
                  href={service.href}
                  className="block font-display text-[clamp(1.6rem,4.4vw,5rem)] font-semibold uppercase leading-[1.1] tracking-[-0.02em] transition-opacity duration-500 hover:opacity-50"
                >
                  {service.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
