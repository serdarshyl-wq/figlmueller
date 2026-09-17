"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import driveOnScroll, { afterFonts } from "@/lib/scrub";

const IMAGE = {
  src: "/about-img/about-philosopy-dummy.jpeg",
  width: 2752,
  height: 1536,
};

const HEADING = { left: "Engineering", right: "Philosophy" };

const BODY = [
  "Every system starts with practical site requirements. Mechanical reliability. Accurate production. Operator control.",
  "Safety. Long-term usability.",
  "Decades of civil engineering experience. German engineering discipline meets UAE market opportunity.",
];

const ENTRY_FROM = 0.3;
const SCRUB = 0.1;

const WORDS_AT = 0;
const WORDS_DURATION = 2.8;
const COPY_AT = 1.9;
const COPY_IN = 1.3;
const COPY_STEP = 0.16;
const TIMELINE_END = 3.6;

export default function AboutPhilosophy() {
  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const left = root.querySelector('[data-word="left"]');
      const right = root.querySelector('[data-word="right"]');
      const lines = root.querySelectorAll(".philosophy-line");
      if (!left || !right || !lines.length) return;

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();

        gsap.set([left, right], { x: 0 });
        const leftBox = left.getBoundingClientRect();
        const rightBox = right.getBoundingClientRect();

        gsap.set(left, { x: -leftBox.right });
        gsap.set(right, { x: window.innerWidth - rightBox.left });
        gsap.set(lines, { y: 0, yPercent: 100 });

        tl = gsap.timeline({ paused: true });
        tl.to(
          [left, right],
          { x: 0, duration: WORDS_DURATION, ease: "power2.out" },
          WORDS_AT
        )
          .to(
            lines,
            {
              yPercent: 0,
              duration: COPY_IN,
              stagger: COPY_STEP,
              ease: "power3.out",
            },
            COPY_AT
          )
          .to({}, { duration: 0.1 }, TIMELINE_END);
      };

      build();

      const clamp01 = gsap.utils.clamp(0, 1);

      const scrollProgress = () => {
        const rect = root.getBoundingClientRect();
        const span = window.innerHeight * ENTRY_FROM;
        if (span <= 0) return 0;
        return clamp01((span - rect.top) / span);
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
      id="engineering-philosophy"
      aria-labelledby="philosophy-heading"
      className="about-philosophy relative z-10 flex min-h-svh flex-col justify-center overflow-x-clip bg-black py-[14svh] text-white"
    >
      <div className="philosophy-band relative flex items-center justify-center px-[4vw]">

        <div className="philosophy-frame aspect-2752/1536 w-[44vw] shrink-0 overflow-hidden">
          <Image
            src={IMAGE.src}
            alt="Figlmueller engineers reviewing machinery on site"
            width={IMAGE.width}
            height={IMAGE.height}
            sizes="44vw"
            className="h-full w-full object-cover"
          />
        </div>

        <h2
          id="philosophy-heading"
          className="philosophy-heading pointer-events-none absolute inset-x-[4vw] flex items-center justify-between font-display text-[clamp(1rem,2.5vw,3.15rem)] font-semibold uppercase leading-none tracking-[-0.02em]"
        >
          <span
            data-word="left"
            className="block will-change-transform"
          >
            {HEADING.left}
          </span>
          <span
            data-word="right"
            className="block will-change-transform"
          >
            {HEADING.right}
          </span>
        </h2>
      </div>

      <div className="philosophy-copy mt-[10svh] px-[4vw]">
        <div className="philosophy-body max-w-[62ch] text-[clamp(0.78rem,0.92vw,1.05rem)] leading-[1.6] text-white/70">
          {BODY.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span
                className={`philosophy-line block will-change-transform ${animated ? "translate-y-full" : ""
                  }`}
              >
                {line}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
