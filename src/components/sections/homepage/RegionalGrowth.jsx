"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import ActionButton from "@/components/ui/ActionButton";
import driveOnScroll, { afterFonts } from "@/lib/scrub";

const HEADING_LINES = [
  "Developed in the",
  "UAE for regional",
  "infrastructure Growth",
];

const LINE_STEP_VW = 22;
const LINE_EXTEND_VW = 32;

const LINE_DRIFT = 0.1;

const MAP_CENTRE = "UAE & Middle East";

const MAP_MARKERS = [
  { label: "Infrastructure", top: "20%", left: "13%" },
  { label: "Civil engineering", top: "13%", left: "45%" },
  { label: "Utilities", top: "30%", left: "71%" },
  { label: "Roadworks", top: "26%", left: "32%" },
  { label: "Automated production", top: "36%", left: "4%" },
  { label: "Transport", top: "66%", left: "20%" },
  { label: "Process control", top: "67%", left: "77%" },
  { label: "Urban development", top: "73%", left: "56%" },
  { label: "TFSM® applications", top: "79%", left: "31%" },
];

const MAP_CTA = {
  lines: ["Explore application", "areas"],
  href: "/services-app-locations-areas",
};

const MAP_NOTES = {
  left: "FIGLMUELLER is positioned to support that growth — mobile machinery, automated production, technical solutions built for the region.",
  right:
    "Practical engineering. Reliable machinery. Efficient production. Long-term infrastructure impact.",
};

const SCRUB = 0.1;
const PASS_DURATION = 8;

const MAP_AT = 8.6;
const MAP_STEP = 0.4;
const MAP_FADE = 0.6;
const TIMELINE_END = 14;

export default function RegionalGrowth() {
  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const train = root.querySelector(".train");
      const lines = root.querySelectorAll(".train-line");
      const reveals = root.querySelectorAll(".map-reveal");
      if (!train) return;

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        gsap.set(train, { x: 0, y: 0, xPercent: 0, yPercent: 0 });
        gsap.set(lines, { x: 0, y: 0, xPercent: 0, yPercent: 0 });
        gsap.set(reveals, { autoAlpha: 0 });

        const unit = window.innerWidth / 100;
        const widths = Array.from(lines, (line) =>
          line.getBoundingClientRect().width
        );

        const indents = widths.map(() => 0);
        for (let index = 1; index < widths.length; index += 1) {
          const stepped = indents[index - 1] + LINE_STEP_VW * unit;
          const cleared =
            indents[index - 1] +
            widths[index - 1] +
            LINE_EXTEND_VW * unit -
            widths[index];
          indents[index] = Math.max(stepped, cleared);
        }

        lines.forEach((line, index) => {
          line.style.marginLeft = `${indents[index]}px`;
        });

        const width = train.getBoundingClientRect().width;
        const drift = window.innerWidth * LINE_DRIFT;

        gsap.set(train, { x: window.innerWidth });

        tl = gsap.timeline({ paused: true });
        tl.to(
          train,
          { x: -width, duration: PASS_DURATION, ease: "none" },
          0
        );

        lines.forEach((line, index) => {
          if (index === 0) return;
          tl.to(
            line,
            { x: -index * drift, duration: PASS_DURATION, ease: "none" },
            0
          );
        });

        reveals.forEach((element, index) => {
          tl.to(
            element,
            { autoAlpha: 1, duration: MAP_FADE, ease: "power2.out" },
            MAP_AT + index * MAP_STEP
          );
        });

        tl.to({}, { duration: 0.1 }, TIMELINE_END);
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
      id="regional-growth"
      aria-labelledby="regional-growth-heading"
      className={`regional-growth relative z-10 bg-bone text-black [--runway:7] ${animated ? "h-[calc(var(--runway)*100vh)]" : ""
        }`}
    >
      <div
        className={
          animated
            ? "grid-paper sticky top-0 flex h-svh items-center overflow-hidden"
            : "grid-paper px-6 py-24 md:px-12"
        }
      >
        <div
          className={
            animated
              ? "fade-out-left flex h-full w-full items-center"
              : "contents"
          }
        >
          <h2
            id="regional-growth-heading"
            className={`train flex flex-none flex-col items-start font-display font-semibold uppercase leading-[0.98] tracking-[-0.02em] ${animated
              ? "text-[clamp(2.5rem,9vw,10rem)] whitespace-nowrap will-change-transform"
              : "text-[clamp(1.75rem,5vw,4rem)]"
              }`}
          >
            {HEADING_LINES.map((line) => (
              <span
                key={line}
                className="train-line block will-change-transform"
              >
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div
          className={
            animated
              ? "map-field absolute inset-0"
              : "map-field relative mt-24 min-h-150 border-t border-black/10 pt-16"
          }
        >
          <h3
            className={`map-centre map-reveal font-display font-semibold uppercase leading-none tracking-[-0.02em] ${animated
              ? "absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-6 text-center text-[clamp(1.75rem,7vw,7.5rem)] invisible opacity-0"
              : "text-[clamp(1.5rem,6vw,4.5rem)]"
              }`}
          >
            {MAP_CENTRE}
          </h3>

          <ul className={animated ? undefined : "mt-8 space-y-2"}>
            {MAP_MARKERS.map((marker) => (
              <li
                key={marker.label}
                className={`map-reveal flex items-start gap-3 font-display font-light uppercase tracking-[0.08em] ${animated
                  ? "absolute text-[clamp(0.7rem,1.15vw,1.35rem)] invisible opacity-0"
                  : "text-[clamp(0.75rem,1.5vw,1.1rem)]"
                  }`}
                style={
                  animated
                    ? { top: marker.top, left: marker.left }
                    : undefined
                }
              >
                <span
                  aria-hidden="true"
                  className="mt-[-0.2em] h-[3.1em] w-px shrink-0 bg-linear-to-b from-black to-transparent"
                />
                {marker.label}
              </li>
            ))}
          </ul>

          <p
            className={`map-note map-note-left map-reveal text-[clamp(0.65rem,0.78vw,0.95rem)] leading-normal text-black/60 ${animated
              ? "absolute bottom-8 left-6 max-w-70 invisible opacity-0 md:bottom-12 md:left-12"
              : "mt-12 max-w-90"
              }`}
          >
            {MAP_NOTES.left}
          </p>

          <p
            className={`map-note map-note-right map-reveal text-[clamp(0.65rem,0.78vw,0.95rem)] leading-normal text-black/60 ${animated
              ? "absolute bottom-8 right-6 max-w-70 text-right invisible opacity-0 md:bottom-12 md:right-12"
              : "mt-6 max-w-90"
              }`}
          >
            {MAP_NOTES.right}
          </p>

          <div
            className={`map-cta-slot map-reveal ${animated
              ? "absolute left-1/2 top-[62%] -translate-x-1/2 invisible opacity-0"
              : "mt-10"
              }`}
          >
            <ActionButton href={MAP_CTA.href} className="map-cta">
              {MAP_CTA.lines.map((line, index) => (
                <span
                  key={line}
                  className={`cta-line${index === 0 ? " mr-[0.3em]" : ""}`}
                >
                  {line}
                </span>
              ))}
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}
