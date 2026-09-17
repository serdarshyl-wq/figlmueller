"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";

const TITLE_IN = 1;
const TITLE_STEP = 0.12;

const COPY_AT = 0.25;
const COPY_IN = 1.2;
const COPY_FROM = 0.5;
const ROW_SPREAD = 0.05;

const ENTER_RATIO = 0.4;

export default function ServicesOverview({ intro }) {
  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      if (!animated) return;

      const root = rootRef.current;
      if (!root) return;

      const lines = root.querySelectorAll(".services-overview-line");
      const copy = root.querySelector(".services-overview-copy");
      const words = Array.from(root.querySelectorAll(".services-overview-word"));
      if (!lines.length || !copy) return;

      const box = root.getBoundingClientRect();
      const wordBoxes = words.map((word) => word.getBoundingClientRect());

      const rows = [];
      wordBoxes.forEach((wordBox, index) => {
        const row = rows.find(
          (candidate) => Math.abs(candidate.top - wordBox.top) < 4
        );
        if (row) row.words.push(words[index]);
        else rows.push({ top: wordBox.top, words: [words[index]] });
      });
      rows.sort((one, other) => one.top - other.top);

      const spread = box.height * ROW_SPREAD;

      gsap.set(lines, { y: 0, yPercent: 100 });
      gsap.set(copy, { autoAlpha: 1, y: box.height * COPY_FROM });
      rows.forEach((row, index) => {
        gsap.set(row.words, { y: index * spread });
      });

      const tl = gsap.timeline({ paused: true });

      tl.to(
        lines,
        {
          yPercent: 0,
          duration: TITLE_IN,
          stagger: TITLE_STEP,
          ease: "power3.out",
        },
        0
      )
        .to(copy, { y: 0, duration: COPY_IN, ease: "power3.out" }, COPY_AT)
        .to(words, { y: 0, duration: COPY_IN, ease: "power3.out" }, COPY_AT);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          tl.play();
        },
        { threshold: ENTER_RATIO }
      );

      observer.observe(root);

      return () => {
        observer.disconnect();
        tl.kill();
      };
    },
    { dependencies: [animated] }
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="services-overview-heading"
      className="flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-[4vw] py-[8vh] text-center"
    >
      <h2
        id="services-overview-heading"
        className="font-display text-[clamp(1.6rem,4.2vw,5.25rem)] font-semibold uppercase leading-[1.02] tracking-[-0.025em]"
      >
        {intro.title.map((line) => (
          <span key={line} className="block overflow-hidden">
            <span
              className={`services-overview-line block will-change-transform ${animated ? "translate-y-full" : ""
                }`}
            >
              {line}
            </span>
          </span>
        ))}
      </h2>

      <p
        className={`services-overview-copy mt-9 max-w-[62ch] text-[clamp(0.85rem,1.05vw,1.25rem)] leading-[1.6] text-black/60 ${animated ? "invisible" : ""
          }`}
      >
        {intro.body.split(" ").map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="services-overview-word mr-[0.28em] inline-block"
          >
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
