"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useReducedMotion from "@/hooks/useReducedMotion";
import driveOnScroll, { afterFonts } from "@/lib/scrub";

const SEPARATOR = "/";
const PROBE_PX = 200;
const TITLE_FILL = 1;
const WORD_IN = 1.4;
const WORD_STEP = 1.6;
const COPY_AT = 5.2;
const COPY_IN = 1.8;
const COPY_FROM = 0.45;
const ROW_SPREAD = 0.05;
const TIMELINE_END = 7.2;
const SCRUB = 0.1;
const COMPACT_MAX = 1279;

export default function CitrineClosing({ closing }) {
  const rootRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const pane = root.querySelector(".closing-pane");
      const line = root.querySelector(".closing-line");
      const words = root.querySelectorAll(".closing-word");
      const copy = root.querySelector(".closing-copy");
      const copyWords = Array.from(root.querySelectorAll(".closing-copy-word"));
      if (!pane || !line || !words.length || !copy) return;

      const range = document.createRange();
      const fit = () => {
        const heading = line.parentElement;
        const compact = window.innerWidth <= COMPACT_MAX;

        if (!compact) {
          words.forEach((word) => {
            word.style.fontSize = "";
          });

          heading.style.fontSize = `${PROBE_PX}px`;
          const probed = line.getBoundingClientRect().width;
          if (!probed) return;
          heading.style.fontSize = `${PROBE_PX * ((heading.clientWidth * TITLE_FILL) / probed)
            }px`;
          return;
        }

        heading.style.fontSize = "";
        const room = heading.clientWidth * TITLE_FILL;

        words.forEach((word) => {
          word.style.fontSize = `${PROBE_PX}px`;
          range.selectNodeContents(word);
          const probed = range.getBoundingClientRect().width;
          if (!probed) return;
          word.style.fontSize = `${PROBE_PX * (room / probed)}px`;
        });
      };

      fit();

      if (!animated) {
        window.addEventListener("resize", fit);
        afterFonts(fit);
        return () => window.removeEventListener("resize", fit);
      }

      let tl = null;
      let disposed = false;

      const build = () => {
        tl?.kill();
        fit();

        const paneHeight = pane.getBoundingClientRect().height;
        const copyBoxes = copyWords.map((word) => word.getBoundingClientRect());
        const rows = [];
        copyBoxes.forEach((wordBox, index) => {
          const row = rows.find(
            (candidate) => Math.abs(candidate.top - wordBox.top) < 4
          );
          if (row) row.words.push(copyWords[index]);
          else rows.push({ top: wordBox.top, words: [copyWords[index]] });
        });
        rows.sort((one, other) => one.top - other.top);

        const spread = paneHeight * ROW_SPREAD;

        gsap.set(words, { y: 0, yPercent: 100 });
        gsap.set(copy, { autoAlpha: 1, y: paneHeight * COPY_FROM });
        rows.forEach((row, index) => {
          gsap.set(row.words, { y: index * spread });
        });

        tl = gsap.timeline({ paused: true });
        tl.to(
          words,
          {
            yPercent: 0,
            duration: WORD_IN,
            stagger: WORD_STEP,
            ease: "power3.out",
          },
          0
        )
          .to(copy, { y: 0, duration: COPY_IN, ease: "power3.out" }, COPY_AT)
          .to(
            copyWords,
            { y: 0, duration: COPY_IN, ease: "power3.out" },
            COPY_AT
          )
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
      aria-labelledby="citrine-closing-heading"
      className={`citrine-closing relative [--runway:5] ${animated ? "h-[calc(var(--runway)*100vh)]" : ""
        }`}
    >
      <div
        className={`closing-pane flex h-svh flex-col justify-center overflow-hidden px-[3vw] py-[10vh] ${animated ? "sticky top-0" : ""
          }`}
      >
        <h2
          id="citrine-closing-heading"
          className="font-display font-semibold uppercase leading-[1.05] tracking-[-0.03em]"
        >
          <span className="closing-line inline-block whitespace-nowrap">
            {closing.title.map((word, index) => (
              <span
                key={word}
                className={`closing-slot inline-block overflow-hidden align-top ${index === closing.title.length - 1 ? "" : "mr-[0.14em]"
                  }`}
              >
                <span
                  className={`closing-word block will-change-transform ${animated ? "translate-y-full" : ""
                    }`}
                >
                  {index === 0 ? null : (
                    <span className="closing-rule">{`${SEPARATOR} `}</span>
                  )}
                  {word}
                </span>
              </span>
            ))}
          </span>
        </h2>

        <p
          className={`closing-copy mt-10 max-w-[70ch] text-[clamp(0.85rem,1.05vw,1.25rem)] uppercase leading-[1.6] tracking-[0.01em] text-black/60 ${animated ? "invisible" : ""
            }`}
        >
          {closing.body.split(" ").map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="closing-copy-word mr-[0.28em] inline-block"
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
