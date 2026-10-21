"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import ActionButton from "@/components/ui/ActionButton";
import driveOnScroll, { afterFonts } from "@/lib/scrub";

const HEADING = ["We", "Build"];

const CTA = {
  label: "View custom machinery",
  href: "/services-custom-machinery",
};

const DISCIPLINES = [
  "Civil engineering",
  "Underground infrastructure",
  "Utility works",
  "Roadworks",
  "Urban development",
];

const FOOTNOTES = [
  "FIGLMUELLER machinery powers the production of advanced TFSM® — Temporarily Flowable Self-Compacting Backfill Material.",
  "FillWaves® is the dedicated material brand — detailed material information lives there.",
];

const BUILD_CLEARANCE = 0.035;
const SPLIT_OPACITY = 0.5;

const COMPACT_MAX = 1279;
const OFF_CLEARANCE = 0.04;

const LIST_NUDGE = 0.03;

const LIST_FROM = 0.72;
const LINE_SPREAD = 0.07;

const SCRUB = 0.1;

const SPLIT_AT = 0;
const SPLIT_DURATION = 3.4;
const LINES_AT = 0.6;
const LINES_DURATION = 3.2;
const NOTES_AT = 4.2;
const NOTE_IN = 1.6;
const NOTE_STAGGER = 0.5;
const TIMELINE_END = 9.2;

const NOTE_SHIFT = 110;

export default function WeBuild({ content }) {
  const headingWords = content?.headingWords?.length ? content.headingWords : HEADING;
  const disciplines = content?.disciplines?.length ? content.disciplines : DISCIPLINES;
  const footnotes = content?.footnotes?.length ? content.footnotes : FOOTNOTES;
  const cta = {
    label: content?.cta?.label || CTA.label,
    href: content?.cta?.href || CTA.href,
  };

  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const heading = root.querySelector(".build-heading");
      const halves = root.querySelectorAll(".build-half");
      const [left, right] = halves;
      const list = root.querySelector(".build-list");
      const lines = root.querySelectorAll(".build-line");
      const notes = root.querySelectorAll(".build-note");
      if (!heading || !left || !right || !list) return;

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        const compact = window.innerWidth <= COMPACT_MAX;

        gsap.set(halves, { x: 0, y: 0, xPercent: 0, yPercent: 0 });
        gsap.set(heading, { opacity: 1 });
        gsap.set(list, {
          x: compact ? 0 : window.innerWidth * LIST_NUDGE,
          y: 0,
          xPercent: 0,
          yPercent: 0,
        });
        gsap.set(lines, { x: 0, y: 0, xPercent: 0, yPercent: 0 });
        gsap.set(notes, { y: 0, yPercent: NOTE_SHIFT });

        const leftRect = left.getBoundingClientRect();
        const rightRect = right.getBoundingClientRect();
        const listRect = list.getBoundingClientRect();

        const spare = window.innerWidth * OFF_CLEARANCE;

        const leftX = compact
          ? -(leftRect.right + spare)
          : -leftRect.left;
        const rightX = compact
          ? window.innerWidth - rightRect.left + spare
          : listRect.right +
          window.innerWidth * BUILD_CLEARANCE -
          rightRect.left;

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
          .to(
            list,
            { y: 0, duration: LINES_DURATION, ease: "none" },
            LINES_AT
          )
          .to(
            lines,
            { y: 0, duration: LINES_DURATION, ease: "none" },
            LINES_AT
          )
          .to(
            notes,
            {
              yPercent: 0,
              duration: NOTE_IN,
              stagger: NOTE_STAGGER,
              ease: "none",
            },
            NOTES_AT
          )
          .to({}, { duration: 0.1 }, TIMELINE_END);
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
      id="we-build"
      aria-labelledby="we-build-heading"
      className={`we-build relative z-10 bg-bone text-black [--runway:4] ${animated ? "h-[calc(var(--runway)*100vh)]" : ""
        }`}
    >
      <div
        className={
          animated
            ? "sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6"
            : "flex flex-col items-center gap-10 px-6 py-24"
        }
      >
        <h2
          id="we-build-heading"
          className={
            animated
              ? "build-heading pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap font-display text-[17vw] font-semibold uppercase leading-none tracking-[-0.03em]"
              : "font-display text-[clamp(2.5rem,9vw,7rem)] font-semibold uppercase leading-none tracking-[-0.03em]"
          }
        >
          {headingWords.map((word, index) => (
            <span
              key={word}
              className={`build-half block will-change-transform${index === 0 ? " mr-[0.22em]" : ""
                }`}
            >
              {word}
            </span>
          ))}
        </h2>

        <div
          className={`build-list relative z-10 flex flex-col items-center${animated ? " will-change-transform" : ""
            }`}
        >
          <ul className="flex flex-col items-center text-center">
            {disciplines.map((item) => (
              <li
                key={item}
                className={`build-line font-display text-[clamp(1.35rem,3.4vw,3.75rem)] font-semibold uppercase leading-[1.12] tracking-[-0.015em] ${animated ? "will-change-transform" : ""
                  }`}
              >
                {item}
              </li>
            ))}
          </ul>

          <ActionButton href={cta.href} className="mt-10">
            {cta.label}
          </ActionButton>
        </div>

        <div
          className={
            animated
              ? "build-notes absolute bottom-8 right-6 z-10 w-full max-w-[48vw] text-right md:bottom-12 md:right-12"
              : "build-notes mt-14 w-full max-w-160 text-right"
          }
        >
          {footnotes.map((note) => (
            <p key={note} className="overflow-hidden">
              <span
                className={`build-note block text-[clamp(0.7rem,0.8vw,0.95rem)] leading-normal text-black/60${animated
                  ? " transform-[translateY(110%)] will-change-transform"
                  : ""
                  }`}
              >
                {note}
              </span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
